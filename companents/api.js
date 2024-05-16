const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDataAndUpdate = async (token, setData, setLastUpdated) => {
  try {
    // İstek gönderilmeden önce 30 saniye bekleyin
    await delay(30000);

    const response = await fetch(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
      {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": "a55ee132-df67-479f-971a-a4bcade81dfb",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Çok fazla istek yapıldı. Bir süre bekleyin ve tekrar deneyin.");
      } else {
        throw new Error("API'den geçersiz yanıt alındı: " + response.status);
      }
    }

    const data = await response.json();

    data.data.forEach((item) => {
      item.quote.USD.price = parseFloat(item.quote.USD.price).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
      item.quote.USD.percent_change_24h = parseFloat(item.quote.USD.percent_change_24h).toString().replace(/(\.\d*?[1-9])0+$/, '$1');
    });

    const currentDate = new Date().toLocaleString();
    setLastUpdated(currentDate);

    if (setData) {
      setData(data.data);
    }
  } catch (error) {
    console.error("Veri alınırken hata oluştu:", error);
    if (error.message.includes("Çok fazla istek yapıldı")) {
      // İsteğin yeniden denemesi için belirli bir süre bekleyin
      await delay(30000);
      // Yeniden deneyin
      fetchDataAndUpdate(token, setData, setLastUpdated);
    } else {
      throw error;
    }
  }

  // Belirli bir süre sonra tekrar veri alın
  setTimeout(() => {
    fetchDataAndUpdate(token, setData, setLastUpdated);
  }, 30000);
};
