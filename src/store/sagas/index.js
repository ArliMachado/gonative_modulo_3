import {
  all, takeLatest, call, put, select,
} from 'redux-saga/effects';
import api from '~/services/api';
import { navigate } from '~/services/navigation';

import { Creators as LoginAction, Types as LoginTypes } from '~/store/ducks/login';
import {
  Creators as RepositoriesActions,
  Types as RepositoriesTypes,
} from '~/store/ducks/repositories';

function* login(action) {
  try {
    const { username } = action.payload;

    yield call(api.get, `/users/${username}`);

    yield put(LoginAction.loginSuccess(username));

    navigate('Repositories');
  } catch (err) {
    yield put(LoginAction.loginFailure());
  }
}

function* loadRepositories() {
  try {
    const { username } = yield select(state => state.login);

    const response = yield call(api.get, `/users/${username}/repos`);

    yield put(RepositoriesActions.loadRepositoriesSuccess(response.data));
  } catch (error) {
    yield put(RepositoriesActions.loadRepositoriesFailure());
  }
}

export default function* rootSaga() {
  return yield all([
    takeLatest(LoginTypes.REQUEST, login),
    takeLatest(RepositoriesTypes.LOAD_REQUEST, loadRepositories),
  ]);
}
