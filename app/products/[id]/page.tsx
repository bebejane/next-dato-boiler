'use server'

import s from './page.module.scss'
import { notFound } from 'next/navigation';
import { AllProductsDocument, ProductDocument } from '@graphql';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { cookies } from 'next/headers';

export async function generateStaticParams() {
  const { allProducts } = await apiQuery<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, { tags: ['product'] });

  return allProducts.map((product) => ({
    id: product.id,
  }))
}

export default async function Product({ params }: { params: { id: string } }) {

  const { product, draftUrl } = await apiQuery<ProductQuery, ProductQueryVariables>(ProductDocument, { variables: { id: params.id } });

  if (!product)
    return notFound();

  const currency = cookies().get('currency')?.value as string;
  const price = product.price.find(p => p.currency.code === currency)

  return (
    <>
      <div className={s.container}>
        <h1>{product.title}</h1>
        {price?.amount} {price?.currency.code}
      </div>
      <DraftMode url={draftUrl} tag={product.id} />
    </>
  )
}