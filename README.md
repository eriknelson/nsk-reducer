# nsk-reducer

A very simple redux reducer generator intended to eliminate the dreaded switch of doom™.

## Usage

Example:

```
// dns/reducer.js
import genReducer from 'nsk-reducer';
import actions, { actionTypes } from './actions';

import Immutable from 'immutable';
const Imm = Immutable, ImmMap = Immutable.Map;

const defaultState = Imm.fromJS({
  model: [],
  app: {
    entriesVisible: true
  }
});

const handlers = ImmMap({
  [actionTypes.LOAD_DNS_FULFILLED]: (state, action) => {
    return state.set('model', Imm.fromJS(action.payload.data));
  },
  [actionTypes.TOGGLE_VISIBLE]: (state, action) => {
    const entriesPath = ['app', 'entriesVisible'];
    const newVal = !state.getIn(entriesPath);
    return state.setIn(entriesPath, newVal);
  }
});

export default genReducer(defaultState, handlers);
```
