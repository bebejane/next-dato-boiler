import exp from 'constants';
import Currency from './Currency';

export default function Layout({ children }) {

  return (
    <>
      <Currency />
      {children}
    </>
  )
}