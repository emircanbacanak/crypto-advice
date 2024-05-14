const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchData = () => {
  return fetch(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
    {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": "a55ee132-df67-479f-971a-a4bcade81dfb",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Çok fazla istek yapıldı. Bir süre bekleyin ve tekrar deneyin.");
        } else {
          throw new Error("API'den geçersiz yanıt alındı: " + response.status);
        }
      }
      return response.json();
    })
    .then((data) => {
      data.data.forEach(item => {
        item.quote.USD.price = parseFloat(item.quote.USD.price).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
        item.quote.USD.percent_change_24h = parseFloat(item.quote.USD.percent_change_24h).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
      });
      return data;
    })
    .catch((error) => {
      console.error("Veri alınırken hata oluştu:", error);
      if (error.message.includes("Çok fazla istek yapıldı")) {
        return delay(10000).then(() => fetchData());
      } else {
        throw error;
      }
    });
};