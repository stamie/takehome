<?php

declare(strict_types=1);

namespace ADS\TakeHome\Controllers;

use ADS\TakeHome\Framework\HttpRequest;
use ADS\TakeHome\Framework\HttpResponseInterface;
use ADS\TakeHome\Framework\JsonHttpResponse;
use ADS\TakeHome\Framework\MySQL;

/**
 * Egy minta controller osztály, a keretrendszer funkcióinak bemutatásához.
 */
class ExampleController
{
    public function __construct(
        private readonly string $greeting,
        private readonly MySQL $db,
    ) {}

    public function sayHello(HttpRequest $request): HttpResponseInterface
    {
        $name = $request->query["name"] ?? null;
        if (!is_string($name)) {
            return new JsonHttpResponse(["error" => "'name' query paraméter kötelező"], 400);
        }
        return new JsonHttpResponse(["message" => "{$this->greeting}, {$name}!"], 200);
    }

    public function getBudapestMaxTempCount(): HttpResponseInterface
    {
        $rows = $this->db->queryAssoc(
            "SELECT 
                COUNT(*) AS `count` 
            FROM 
                weather.maximum_temperatures 
            WHERE 
                city_id = :cityId
            ",
            [":cityId" => 1],
        );
        return new JsonHttpResponse($rows[0]);
    }
    
    public function getWeatherOfCity(HttpRequest $request): HttpResponseInterface
    {
        $cityId = $request->query['city_id'];
        $minDate = $request->query['min_date'];
        $maxDate = $request->query['max_date'];
        
        if (!is_string($cityId) || !is_string($minDate) || !is_string($maxDate)) {
            return new JsonHttpResponse(["error" => "'city_id', 'min_date' és 'max_date' query paraméterek kötelezőek"], 400);
        }
        if (!preg_match('/^\d+$/', $cityId)) {
            return new JsonHttpResponse(["error" => "'city_id' query paraméternek számnak kell lennie"], 400);
        }
        if (!preg_match('/^\d{8}$/', $minDate) || !preg_match('/^\d{8}$/', $maxDate)) {
            return new JsonHttpResponse(["error" => "'min_date' és 'max_date' query paramétereknek 'YYYY-MM-DD' formátumúnak kell lenniük"], 400);
        }

        $rows = $this->db->queryAssoc(
            "SELECT 
                c.id City_id, 
                p.date,
                maxt.max_temp max_temp,
                mint.min_temp min_temp,
                p.precipitation precipitation
                FROM cities c 
                    INNER JOIN maximum_temperatures maxt ON c.id = maxt.city_id 
                    INNER JOIN minimum_temperatures mint ON c.id = mint.city_id 
                    INNER JOIN precipitation p ON c.id = p.city_id 
                        WHERE c.id = :cityId AND
                            maxt.date = mint.date AND maxt.date = p.date AND
                            maxt.date >= :minDate AND maxt.date <= :maxDate AND
                            mint.date >= :minDate AND mint.date <= :maxDate AND
                            p.date >= :minDate AND p.date <= :maxDate;",
            [":cityId" => $cityId, ":minDate" => $minDate, ":maxDate" => $maxDate]
        );
        return new JsonHttpResponse($rows);
    }
    
    public function getWeatherOfRegion(HttpRequest $request): HttpResponseInterface
    {
        $regionName = $request->query['region'];
        $minDate = $request->query['min_date'];
        $maxDate = $request->query['max_date'];
        
        if (!is_string($regionName) || !is_string($minDate) || !is_string($maxDate)) {
            return new JsonHttpResponse(["error" => "'city_id', 'min_date' és 'max_date' query paraméterek kötelezőek"], 400);
        }
        if (!preg_match('/^\d{8}$/', $minDate) || !preg_match('/^\d{8}$/', $maxDate)) {
            return new JsonHttpResponse(["error" => "'min_date' és 'max_date' query paramétereknek 'YYYY-MM-DD' formátumúnak kell lenniük"], 400);
        }
        $rows = $this->db->queryAssoc(
            "SELECT 
                c.region regionName,  
                p.date date, 
                avg(maxt.max_temp) max_temp, 
                avg(mint.min_temp) min_temp, 
                avg(p.precipitation) precipitation 
                FROM cities c 
                    INNER JOIN maximum_temperatures maxt ON c.id = maxt.city_id 
                    INNER JOIN minimum_temperatures mint ON c.id = mint.city_id 
                    INNER JOIN precipitation p ON c.id = p.city_id 
                        WHERE c.region like :regionName AND 
                            maxt.date = mint.date AND maxt.date = p.date AND 
                            maxt.date >= :minDate AND maxt.date <= :maxDate AND 
                            mint.date >= :minDate AND mint.date <= :maxDate AND 
                            p.date >= :minDate AND p.date <= :maxDate 
                        GROUP BY 
                            c.region, p.date
                        ORDER BY
                            p.date
                        ASC
                        ;",
            [":regionName" => $regionName, ":minDate" => $minDate, ":maxDate" => $maxDate]
        );
        return new JsonHttpResponse($rows);
    }
}