# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json

SUPPORTED_TOKENS = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
    "BNB": "binancecoin",
    "AVAX": "avalanche-2",
    "LINK": "chainlink",
    "UNI": "uniswap",
}


class PriceFeedContract(gl.Contract):
    prices: TreeMap[str, str]

    def __init__(self):
        self.prices = TreeMap()

    @gl.public.view
    def get_supported_tokens(self) -> str:
        return json.dumps(list(SUPPORTED_TOKENS.keys()))

    @gl.public.view
    def get_price(self, symbol: str) -> str:
        symbol = symbol.upper()
        if symbol not in self.prices:
            return json.dumps({
                "error": f"No cached price for {symbol}. Call refresh_price first."
            })
        return json.dumps({"symbol": symbol, "price_usd": self.prices[symbol]})

    @gl.public.view
    def get_all_prices(self) -> str:
        result = {}
        for symbol in SUPPORTED_TOKENS.keys():
            if symbol in self.prices:
                result[symbol] = self.prices[symbol]
        return json.dumps(result)

    @gl.public.write
    def refresh_price(self, symbol: str) -> None:
        symbol = symbol.upper()
        if symbol not in SUPPORTED_TOKENS:
            raise gl.UserError(
                f"Token {symbol} not supported. Supported: {list(SUPPORTED_TOKENS.keys())}"
            )

        coin_id = SUPPORTED_TOKENS[symbol]
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd"

        def leader_fn():
            response = gl.nondet.web.request(url, method="GET")
            if response.status_code != 200:
                raise gl.UserError(f"CoinGecko API returned status {response.status_code}")
            data = json.loads(response.body.decode("utf-8"))
            price = data[coin_id]["usd"]
            return str(price)

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            try:
                leader_price = float(leader_result.calldata)
                my_price = float(leader_fn())
                diff = abs(leader_price - my_price) / max(leader_price, my_price)
                return diff <= 0.02
            except Exception:
                return False

        price = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        self.prices[symbol] = price

    @gl.public.write
    def refresh_all_prices(self) -> None:
        ids_str = ",".join(SUPPORTED_TOKENS.values())
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={ids_str}&vs_currencies=usd"

        def leader_fn():
            response = gl.nondet.web.request(url, method="GET")
            if response.status_code != 200:
                raise gl.UserError(f"CoinGecko API returned status {response.status_code}")
            data = json.loads(response.body.decode("utf-8"))
            result = {}
            for sym, coin_id in SUPPORTED_TOKENS.items():
                if coin_id in data and "usd" in data[coin_id]:
                    result[sym] = str(data[coin_id]["usd"])
            return result

        def validator_fn(leader_result) -> bool:
            if not isinstance(leader_result, gl.vm.Return):
                return False
            try:
                leader_prices = leader_result.calldata
                my_prices = leader_fn()
                for sym in leader_prices:
                    if sym not in my_prices:
                        return False
                    lp = float(leader_prices[sym])
                    mp = float(my_prices[sym])
                    diff = abs(lp - mp) / max(lp, mp)
                    if diff > 0.02:
                        return False
                return True
            except Exception:
                return False

        prices = gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
        for sym, price in prices.items():
            self.prices[sym] = price
