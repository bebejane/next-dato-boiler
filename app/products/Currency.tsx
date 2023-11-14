'use server'

import s from './Currency.module.scss'
import { apiQuery, DraftMode } from 'next-dato-utils';
import { AllCurrenciesDocument } from '@graphql';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { setCurrency } from '@app/products/actions';

export default async function Currencies() {

  const { allCurrencies, draftUrl } = await apiQuery<AllCurrenciesQuery, AllCurrenciesQueryVariables>(AllCurrenciesDocument, {
    tags: ['currency']
  });

  const currency = cookies().get('currency')?.value;

  return (
    <>
      <form className={s.container} action={setCurrency}>
        <select name="code" defaultValue={currency}>
          {allCurrencies.map(currency => (
            <option key={currency.id}>
              {currency.code}
            </option>
          ))}
        </select>
        <button type="submit">Set currency</button>
      </form>

      <DraftMode url={draftUrl} tag="currency" />
    </>
  )
}