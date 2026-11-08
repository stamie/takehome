import { useState } from "react";

export function RegionSelect() {
  const [name, setName] = useState("vendég");
  const [error, setError] = useState<string | null>(null);

  const onGreetingRequest = async () => {
    if (name.trim().length === 0) {
      setError("Kötelező kitölteni");
      return;
    }

    setError(null);

    try {
      const greeting = await getGreeting(name);
      window.alert(greeting);
    } catch (e) {
      window.alert(`hiba: ${e}`);
    }
  };

  return (
    <div className="py-4 px-8 max-w-md mx-auto mt-8 border-2 border-solid border-amber-500 rounded-lg">
      <div className="flex flex-col">
        <label htmlFor="region" className="p-2 font-bold">
          Régió kiválasztása:
        </label>
               <select
          id="region"
          defaultValue={value}
          onChange={(e) => {
            setName(e.target.value);
          }}
        >
        <option value="0">Válassz várost</option>
        <option value="1">Budapest</option>
        <option value="2">Debrecen</option>
        <option value="3">Szeged</option>
        <option value="4">Miskolc</option>
        <option value="5">Pécs</option>
        </select>
        {error && <span className="text-red-500 text-sm">{error}</span>}
         <button
          onClick={(e) => {
            e.preventDefault();
            onGreetingRequest();
          }}
          className="mt-16 py-2 px-4 font-bold bg-amber-300 hover:bg-amber-400 active:bg-amber-500 rounded-lg cursor-pointer"
        >
        <button
          onClick={(e) => {
            e.preventDefault();
            onGreetingRequest();
          }}
          className="mt-16 py-2 px-4 font-bold bg-amber-300 hover:bg-amber-400 active:bg-amber-500 rounded-lg cursor-pointer"
        >
          Üdvözlést kérek!
        </button>
      </div>
    </div>
  );
}

async function getGreeting(name: string): Promise<string> {
  const baseUrl = import.meta.env.VITE_API_URL;

  const res = await fetch(`${baseUrl}/hello?name=${name}`);
  if (!res.ok) {
    const err = await res.text();
    throw Error(err);
  }
  const body = (await res.json()) as { message: string };
  return body.message;
}
