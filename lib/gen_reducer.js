const assert = require('assert');
const Imm = require('immutable'), ImmMap = Imm.Map;

function genReducer(defaultState, handlerTable) {
  assert(handlerTable != null, 'handlerTable null or undefined');
  assert(ImmMap.isMap(handlerTable), 'handlerTable is not an Immutable.Map');
  assert(handlerTable.size !== 0, 'handlerTable is empty');

  return (state, action) => {
    assert(action.type != null, 'action is missing a type');

    if(state == null) {
      state = defaultState;
    }

    const isHandlerDefined = handlerTable.has(action.type);
    return isHandlerDefined ?
      handlerTable.get(action.type)(state, action) : state;
  }
}

module.exports = genReducer;
