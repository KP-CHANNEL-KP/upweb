interface BuyResponse {
  id?: number;
  error?: string;
}

const handleCreateKey = async () => {
  if (!selectedKey) return;

  setLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan: selectedKey.name,
      }),
    });

    const data: BuyResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || 'Order တင်ရာတွင် အမှားဖြစ်ပွားသည်'
      );
    }

    if (data.id) {
      setOrderId(data.id);
    }
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Unknown Error'
    );
  } finally {
    setLoading(false);
  }
};