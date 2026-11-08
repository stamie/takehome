import { useState } from "react";

export function RegionSelect() {
  const [region, setRegion] = useState("region");
  const [minDate, setMinDate] = useState("min_date");
  const [maxDate, setMaxDate] = useState("max_date");
  const [error, setError] = useState<string | null>(null);

  const onRegionRequest = async () => {
    let region_ = region;
    if (region_ === "") {
      setError("Kötelező választani");
      return;
    }
    let minDate_ = parseInt(minDate.replace(/-/g, ""));
    if (minDate_ === 0) {
      setError("Kötelező kitölteni");
      return;
    }
    let maxDate_ = parseInt(maxDate.replace(/-/g, ""));
    if (maxDate_ === 0) {
      setError("Kötelező kitölteni");
      return;
    }
    if (minDate_ > maxDate_) {
      setError("A kezdő dátum nem lehet nagyobb a végdátumnál");
      return;
    }


    setError(null);

    try {
      const weathers = await getRegion(region_, minDate_, maxDate_);
      const table = document.getElementById("table");
      if (table) {
        table.classList.remove("hidden");
        const tableElement = table.querySelector("table");
        if (tableElement) {
          tableElement.innerHTML = weathers;
        }
      }

    } catch (e) {
      window.alert(`hiba: ${e}`);
    }
  };

  return (
    <div className="py-8 px-8 max-w-800 mx-auto mt-8 ml-8 mr-8 border-2 border-solid border-amber-500 rounded-lg">
      <div className="flex flex-row justify-around items-end">
        <label htmlFor="region" >
        <p className="p-2 font-bold">Régió kiválasztása: </p>
        
        <select
          id="region"
          defaultValue={region}
          onChange={(e) => {
            setRegion(e.target.value);
          }}
        >
          <option value="">Válassz régiót</option>
          <option value="Dunántúl">Dunántúl</option>
          <option value="Közép-Magyarország">Közép-Magyarország</option>
          <option value="Észak és Alföld">Észak és Alföld</option>

        </select>
        </label>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <input type="date" id="min_date" name="min_date"
          onChange={(e) => {
            setMinDate(e.target.value);
          }}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <input type="date" id="max_date" name="max_date"
          onChange={(e) => {
            setMaxDate(e.target.value);
          }}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <button
          onClick={(e) => {
            e.preventDefault();
            onRegionRequest();
          }}
          className="mt-16 py-2 px-4 font-bold bg-amber-300 hover:bg-amber-400 active:bg-amber-500 rounded-lg cursor-pointer"
        >
          Lekérem a régió időjárását!
        </button>
      </div>
      <div id="table" className="py-4 px-8 max-w-650 mx-auto mt-8 border-2 border-solid border-amber-500 rounded-lg hidden">
        <table style={{ 'width': '80%', 'margin': '0 auto' }}></table>
      </div>
    </div>

  );
}

async function getRegion(region: string, min_date: BigInt, max_date: BigInt): Promise<string> {
  const baseUrl = import.meta.env.VITE_API_URL;

  const res = await fetch(`${baseUrl}/region?region=${region}&min_date=${min_date}&max_date=${max_date}`);
  if (!res.ok) {
    const err = await res.text();
    throw Error(err);
  }
  const data = await res.json();
  let tbody = Array.isArray(data) ? data : toArray(data);
  const body = 
  "<tbody>" + tbody.map(row => {
    if (row == undefined  || row == "") return "";
    return `<tr>
        <td style="border-width: 2px" class="border border-amber-500">${row.date.toString().substring(0, 4)}/${row.date.toString().substring(4, 6)}/${row.date.toString().substring(6, 9)} </td>
        <td style="border-width: 2px" class="border border-amber-500">${(row.max_temp + row.min_temp) / 2} Celsius</td>
        <td style="border-width: 2px" class="border border-amber-500">${row.precipitation} ml</td>
      </tr>`

  }


  ).join("") + "</tbody>";
  const header = `<thead class="bg-amber-300">
  <tr>
    <th style="border-width: 2px" class="border border-amber-500">Dátum</th>
    <th style="border-width: 2px" class="border border-amber-500">Átlagos hőmérséklet</th>
    <th style="border-width: 2px" class="border border-amber-500">Csapadék</th>
  </tr>
</thead>`;
  return header + body;
}