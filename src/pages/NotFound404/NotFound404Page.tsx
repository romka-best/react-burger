import {useHistory} from 'react-router-dom';

import {Logo, Button} from '@ya.praktikum/react-developer-burger-ui-components';

import notFound404Styles from './NotFound404Page.module.scss';

const NotFound404Page = () => {
  const history = useHistory<History>();
  const toMainPage = (): void => {
    history.replace({pathname: '/'});
  }

  return (
    <main className={notFound404Styles.root}>
      <Logo/>
      <p className={`${notFound404Styles.errorText} text text_type_main-medium`}>Такой страницы не существует 😔</p>
      <Button type='secondary' size='medium' onClick={toMainPage}>
        Перейти на главную
      </Button>
    </main>
  );
};

export default NotFound404Page;
