import { useSDK } from "@thirdweb-dev/react";
import type { NextApiRequest, NextApiResponse } from "next";
import PosterityWalletABI from "../../abis/PosterityWallet.json";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET'){

    const cpf = req.body

    console.log(cpf)

    const url = 'https://cadastral-situation-of-the-brazilian-cpf-numbers.p.rapidapi.com/';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': `${process.env.NEXT_PUBLIC_RAPID_API_KEY}`,
        'X-RapidAPI-Host': 'cadastral-situation-of-the-brazilian-cpf-numbers.p.rapidapi.com'
      },
      body: new URLSearchParams({
        cpfNumber: `${cpf}`
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);

      return res.status(200).json({ result });

    } catch (error) {
      console.error(error)
      return res.status(400).json({ message: 'Bad Request'});
    }
  }
  
  return res.status(405).json({ message: 'Method not allowed'});
};