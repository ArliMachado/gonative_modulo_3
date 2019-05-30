import {
  all, takeLatest, call, put,
} from 'redux-saga/effects';
import api from '~/services/api';

import * as LoginAction from '~/store/actions/login';

function* login(action) {
  try {
    const { username } = action.payload;

    yield call(api.get, `/users/${username}`);

    yield put(LoginAction.loginSuccess(username));

    // navigation.navigate('Repositories');
  } catch (err) {
    yield put(LoginAction.loginFailure());
  }
}

export default function* rootSaga() {
  return yield all([takeLatest('LOGIN_REQUEST', login)]);
}
