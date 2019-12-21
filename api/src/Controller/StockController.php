<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class StockController extends AbstractController
{
    /**
     * @Route("/symbols", name="symbol_list", methods={"GET", "OPTIONS"})
     */
    public function getSymbols()
    {
        $url = 'https://pkgstore.datahub.io/core/nasdaq-listings/nasdaq-listed_json/data/a5bc7580d6176d60ac0b2142ca8d7df6/nasdaq-listed_json.json';
        $client = HttpClient::create();
        $res = $client->request('GET', $url);
        $stocks = json_decode($res->getContent());
        if ($res->getStatusCode() !== 200 || empty($stocks))
            return new Response("Error getting symbols", Response::HTTP_INTERNAL_SERVER_ERROR);

        $symbols = array();

        foreach ($stocks as $stock) {
            array_push($symbols, $stock->Symbol);
        }

        $response = new Response(json_encode($symbols), Response::HTTP_OK, ['content-type' => 'application/json']);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }

    /**
     * @Route("/data", name="stock_data", methods={"GET", "OPTIONS"})
     * @param Request $request
     * @return Response|void
     * @throws \Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface
     * @throws \Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface
     */
    public function getStockData(Request $request)
    {
        $url = 'https://www.quandl.com/api/v3/datasets/WIKI/'.$request->get('symbol').'.csv?api_key='.$_ENV['QUANDL_API_KEY'].'&order=asc&start_date='.$request->get('startDate').'&end_date='.$request->get('endDate');
        $client = HttpClient::create();
        $csv = $client->request('GET', $url)->getContent();
        //$csv = str_getcsv($client->request('GET', $url)->getContent());
        $csv = explode("\n", $csv);
        array_shift($csv);
        array_pop($csv);
        $data = array();

        foreach ($csv as $line) {
            $temp = array();
            $row = explode(',', $line);


            array_push($temp, intval(strtotime($row[0]) . '000')); //Converting to timestamp for chart
            array_push($temp, round(floatval($row[1]), 2));
            array_push($temp, round(floatval($row[2]), 2));
            array_push($temp, round(floatval($row[3]), 2));
            array_push($temp, round(floatval($row[4]), 2));
            array_push($temp, intval($row[5]));

            array_push($data, $temp);
        }

        //TODO Send email to user using $request->get('email'), ideally placing this process in an async queue

        $response = new Response(json_encode($data), Response::HTTP_OK, ['content-type' => 'application/json']);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        return $response;
    }


}