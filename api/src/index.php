<?php

namespace ADS\TakeHome;

include __DIR__ . "/../vendor/autoload.php";

use ADS\TakeHome\Controllers\ExampleController;
use ADS\TakeHome\Framework\MySQL;
use ADS\TakeHome\Framework\Router;

$router = new Router();

$mysql = new MySQL("db", "weather", "root", "root");
$helloController = new ExampleController(greeting: "Hello", db: $mysql);

$router->addRoute("GET", "/hello", $helloController->sayHello(...));
$router->addRoute("GET", "/budapest", $helloController->getBudapestMaxTempCount(...));
// TODO: többi végpont

$router->addRoute("GET", "/cities", $helloController->getCities(...));
$router->addRoute("GET", "/city", $helloController->getWeatherOfCity(...));
$router->addRoute("GET", "/region", $helloController->getWeatherOfRegion(...));

$router->handleRequest();
