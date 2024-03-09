'use server'

import s from './page.module.scss'
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { AllProductsDocument } from '@graphql';
import Link from 'next/link';
import { cookies } from 'next/headers';

export default async function Products() {

  const { allProducts, draftUrl } = await apiQuery<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, {
    generateTags: false,
    tags: ['product']
  });

  const currency = cookies().get('currency')?.value as string;

  return (
    <>
      <div className={s.container}>
        <h1>All products</h1>
        <ul>
          {allProducts.map(product => (
            <li key={product.id}>
              <Link href={`/products/${product.id}`}>{product.title}</Link> {product.price.find(p => p.currency.code === currency).amount} {product.price.find(p => p.currency.code === currency).currency.code}
            </li>
          ))}
        </ul>
      </div>
      <DraftMode url={draftUrl} path="/products" />
    </>
  )
}