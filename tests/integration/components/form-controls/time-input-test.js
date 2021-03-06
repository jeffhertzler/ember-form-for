import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-controls/time-input', 'Integration | Component | {{form-controls/time-input}}', {
  integration: true
});

test('It renders a time input', function(assert) {
  this.render(hbs`{{form-controls/time-input}}`);
  assert.equal(this.$('input[type="time"]').length, 1, 'Input is rendered');
});

test('It accepts a time value', function(assert) {
  this.set('value', new Date(2015, 9, 21, 16, 9));
  this.render(hbs`{{form-controls/time-input value=value}}`);
  assert.equal(this.$('input').val(), '16:09', 'Time value is set');
});
