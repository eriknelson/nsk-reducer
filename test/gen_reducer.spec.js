const expect = require('chai').expect;
const genReducer = require('../index');
const Imm = require('immutable'), ImmMap = Imm.Map, ImmList = Imm.List;

describe('action routing', function() {
  it('should export genReducer as a function', function() {
    expect(genReducer).to.be.ok;
    expect(typeof genReducer === 'function').to.be.ok;
  });

  it('should assert non null and undefined values for handlerTable', function() {
    expect(() => genReducer({}, undefined)).to.throw(
      'handlerTable null or undefined');
    expect(() => genReducer({}, null)).to.throw(
      'handlerTable null or undefined');
  });

  it('should assert handlerTable is an Immutable.Map', function() {
    expect(() => genReducer({}, 1)).to.throw(
      'handlerTable is not an Immutable.Map');
  });

  it('should assert handlerTable is not empty', function() {
    expect(() => genReducer({}, ImmMap())).to.throw(
      'handlerTable is empty');
  });

  it('should assert action has a type', function() {
    const reducer = genReducer(
      ImmList(), Imm.fromJS({'ACTION': (state, _) => state})
    );

    expect(() => reducer(ImmList(), {type: 'ACTION'})).to.not.throw(
      'action is missing a type');
    expect(() => reducer(ImmList(), {})).to.throw(
      'action is missing a type');
  });

  it('should return expected next state if handler is defined', function() {
    const handlerTable = ImmMap({
      'MUTATE_FOO': (state, action) => {
        return state.set('foo', 'baz');
      }
    });

    const beforeState = ImmMap({
      foo: 'bar'
    });

    const afterState = ImmMap({
      foo: 'baz'
    });

    const reducer = genReducer(ImmMap(), handlerTable);
    const outputState = reducer(beforeState, {type: 'MUTATE_FOO'});

    expect(outputState.equals(beforeState)).to.be.false;
    expect(outputState.equals(afterState)).to.be.true;
  });

  it('should return same state if handler is not defined', function() {
    const handlerTable = ImmMap({
      'MUTATE_DERP': (state, action) => {
        return state.set('foo', 'baz');
      }
    });

    const beforeState = ImmMap({
      foo: 'bar'
    });

    const reducer = genReducer(ImmMap(), handlerTable);
    const outputState = reducer(beforeState, {type: 'MUTATE_FOO'});

    expect(outputState.equals(beforeState)).to.be.true;
  });

  it('should return default state if no state is passed to reducer and handler not registered', function() {
    const handlerTable = ImmMap({
      'MUTATE_DERP': (state, action) => {
        return state.set('foo', 'baz');
      }
    });

    const beforeState = ImmMap({
      foo: 'bar'
    });

    const reducer = genReducer(ImmMap(), handlerTable);
    const outputState = reducer(undefined, {type: 'MUTATE_FOO'});
    expect(outputState).to.be.ok;
    expect(ImmMap.isMap(outputState)).to.be.true;
    expect(outputState.size === 0).to.be.true;
  });

  it('should return expected handler state if no state is passed to reducer and handler is registered', function() {
    const handlerTable = ImmMap({
      'MUTATE_FOO': (state, action) => {
        return state.set('foo', 'baz');
      }
    });

    const beforeState = ImmMap({
      foo: 'bar'
    });

    const afterState = ImmMap({
      foo: 'baz'
    });

    const reducer = genReducer(ImmMap(), handlerTable);
    const outputState = reducer(beforeState, {type: 'MUTATE_FOO'});
    expect(outputState.equals(beforeState)).to.be.false;
    expect(outputState.equals(afterState)).to.be.true;
  });
});
