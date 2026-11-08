import { useState, useEffect } from "react";

export function CitySelect() {
  const [city, setCityId] = useState("0");
  const [cities, setCities] = useState<any[]>([]);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, setLoading] = useState(true);

  // A useEffect most már a komponens legfelső szintjén van, így betöltődéskor lekéri a városokat
  useEffect(() => {
    async function fetchCities() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${baseUrl}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Hiba történt a városok betöltésekor:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  const onCityRequest = async () => {
    let city_ = parseInt(city);
    if (city_ === 0) {
      setError("Kötelező választani várost!");
      return;
    }
    if (!minDate) {
      setError("Kötelező kitölteni a kezdő dátumot!");
      return;
    }
    if (!maxDate) {
      setError("Kötelező kitölteni a végdátumot!");
      return;
    }

    let minDate_ = parseInt(minDate.replace(/-/g, ""));
    let maxDate_ = parseInt(maxDate.replace(/-/g, ""));

    if (minDate_ > maxDate_) {
      setError("A kezdő dátum nem lehet nagyobb a végdátumnál!");
      return;
    }

    setError(null);

    try {
      const weathers = await getCity(city_, minDate_, maxDate_);
      const table = document.getElementById("table");
      if (table) {
        table.classList.remove("hidden");
        const tableElement = table.querySelector("table");
        if (tableElement) {
          tableElement.innerHTML = weathers;
        }
      }
    } catch (e) {
      window.alert(`Hiba: ${e}`);
    }
  };

  return (
    <div className="py-8 px-8 max-w-[800px] mx-auto mt-8 ml-8 mr-8 border-2 border-solid border-amber-500 rounded-lg">
      <div className="flex flex-col space-y-4">
        <label htmlFor="city" className="font-bold">
          Város kiválasztása:
        </label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCityId(e.target.value)}
          className="border border-amber-500 p-2 rounded-lg"
        >
          <option value="0">Válassz várost</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label htmlFor="min_date" className="font-bold">Kezdő dátum:</label>
        <input
          type="date"
          id="min_date"
          name="min_date"
          className="border border-amber-500 p-2 rounded-lg"
          onChange={(e) => setMinDate(e.target.value)}
        />

        <label htmlFor="max_date" className="font-bold">Végdátum:</label>
        <input
          type="date"
          id="max_date"
          name="max_date"
          className="border border-amber-500 p-2 rounded-lg"
          onChange={(e) => setMaxDate(e.target.value)}
        />

        {error && <span className="text-red-500 text-sm font-semibold">{error}</span>}

        <button
          onClick={(e) => {
            e.preventDefault();
            onCityRequest();
          }}
          className="mt-4 py-2 px-4 font-bold bg-amber-300 hover:bg-amber-400 active:bg-amber-500 rounded-lg cursor-pointer"
        >
          Lekérem a város időjárását!
        </button>
      </div>

      <div id="table" className="py-4 px-8 max-w-[650px] mx-auto mt-8 border-2 border-solid border-amber-500 rounded-lg hidden">
        <table style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse' }}></table>
      </div>
    </div>
  );
}

async function getCity(id: number, min_date: number, max_date: number): Promise<string> {
  const baseUrl = import.meta.env.VITE_API_URL;

  const res = await fetch(`${baseUrl}/city?city_id=${id}&min_date=${min_date}&max_date=${max_date}`);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const data = await res.json();

  const body = '<tbody>' + data.map((row: any) => {
    const dateStr = row.date.toString();
    return `<tr>
      <td style="border-width: 2px" class="border border-amber-500 p-2">${dateStr.substring(0, 4)}/${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}</td>
      <td style="border-width: 2px" class="border border-amber-500 p-2">${row.max_temp} Celsius</td>
      <td style="border-width: 2px" class="border border-amber-500 p-2">${row.min_temp} Celsius</td>
      <td style="border-width: 2px" class="border border-amber-500 p-2">${row.precipitation} ml</td>
    </tr>`;
  }).join("") + '</tbody>';

  const header = `<thead class="bg-amber-300">
    <tr>
      <th style="border-width: 2px" class="border border-amber-500 p-2">Dátum</th>
      <th style="border-width: 2px" class="border border-amber-500 p-2">Maximális hőmérséklet</th>
      <th style="border-width: 2px" class="border border-amber-500 p-2">Minimális hőmérséklet</th>
      <th style="border-width: 2px" class="border border-amber-500 p-2">Csapadék</th>
    </tr>
  </thead>`;

  return header + body;
}