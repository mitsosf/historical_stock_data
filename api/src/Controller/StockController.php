<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
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


}