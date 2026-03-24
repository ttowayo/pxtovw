import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
import numpy as np

def get_market_data():
    print("=== 미국 주식 시장 현황 ===")
    tickers = ['^GSPC', '^IXIC', '^DJI']
    data = {}
    
    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period='5d')
            if not hist.empty:
                data[ticker] = hist
                change_pct = ((hist.iloc[-1].Close/hist.iloc[0].Close-1)*100)
                print(f"{ticker}: 현재가 ${hist.iloc[-1].Close:.2f}, 5일 변동률 {change_pct:.2f}%")
        except Exception as e:
            print(f"Error with {ticker}: {e}")
    
    print("\n=== 주요 섹터별 성과 ===")
    sector_tickers = ['XLK', 'XLF', 'XLV', 'XLE', 'XLU']
    for ticker in sector_tickers:
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period='5d')
            if not hist.empty:
                change_pct = ((hist.iloc[-1].Close/hist.iloc[0].Close-1)*100)
                print(f"{ticker}: {change_pct:.2f}%")
        except Exception as e:
            print(f"Error with {ticker}: {e}")

def analyze_stock(ticker, period='1mo'):
    """개별 주식 분석"""
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period)
        
        if hist.empty:
            return None
            
        current_price = hist.iloc[-1].Close
        sma_20 = hist['Close'].rolling(window=20).mean().iloc[-1]
        sma_50 = hist['Close'].rolling(window=50).mean().iloc[-1]
        
        # RSI 계산
        delta = hist['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        current_rsi = rsi.iloc[-1]
        
        # 볼린저 밴드
        bb_20 = hist['Close'].rolling(window=20).mean()
        bb_std = hist['Close'].rolling(window=20).std()
        bb_upper = bb_20 + (bb_std * 2)
        bb_lower = bb_20 - (bb_std * 2)
        
        current_bb_upper = bb_upper.iloc[-1]
        current_bb_lower = bb_lower.iloc[-1]
        
        # 거래량 분석
        avg_volume = hist['Volume'].rolling(window=20).mean().iloc[-1]
        current_volume = hist['Volume'].iloc[-1]
        volume_ratio = current_volume / avg_volume
        
        return {
            'ticker': ticker,
            'current_price': current_price,
            'sma_20': sma_20,
            'sma_50': sma_50,
            'rsi': current_rsi,
            'bb_upper': current_bb_upper,
            'bb_lower': current_bb_lower,
            'volume_ratio': volume_ratio,
            'price_change_5d': ((current_price / hist.iloc[-5].Close - 1) * 100) if len(hist) >= 5 else 0
        }
    except Exception as e:
        print(f"Error analyzing {ticker}: {e}")
        return None

if __name__ == "__main__":
    get_market_data()
    
    # 추천 종목 분석
    candidates = ['NVDA', 'TSLA', 'AMD', 'META', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NFLX', 'CRM']
    
    print("\n=== 추천 종목 분석 ===")
    results = []
    
    for ticker in candidates:
        result = analyze_stock(ticker)
        if result:
            results.append(result)
            print(f"\n{ticker}:")
            print(f"  현재가: ${result['current_price']:.2f}")
            print(f"  RSI: {result['rsi']:.1f}")
            print(f"  5일 변동률: {result['price_change_5d']:.2f}%")
            print(f"  거래량 비율: {result['volume_ratio']:.2f}")
            print(f"  SMA20 대비: {((result['current_price']/result['sma_20']-1)*100):.2f}%")