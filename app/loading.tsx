import s from './loading.module.scss'
import { ImSpinner8 } from 'react-icons/im'

export default function Loading() {
  return <div className={s.loading}><ImSpinner8 /></div>
}