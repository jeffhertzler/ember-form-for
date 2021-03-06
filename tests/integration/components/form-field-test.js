import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

const { guidFor } = Ember;

moduleForComponent('form-field', 'Integration | Component | {{form-field}}', {
  integration: true,

  setup() {
    this.set('object', { givenName: 'Albert' });
  }
});

test('It requires an object', function(assert) {
  assert.throws(() => {
    this.render(hbs`{{form-field}}`);
  }, /{{form-field}} requires an object property to be passed in/);
});

test('It requires a propertyName', function(assert) {
  assert.throws(() => {
    this.render(hbs`{{form-field object}}`);
  }, /{{form-field}} requires the propertyName property to be set/);
});

test('It adds a label based on propertyName', function(assert) {
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}{{f.label}}{{/form-field}}
  `);
  assert.equal(this.$('label').text().trim(), 'Given name');
});

test('It yields a text input as a default control', function(assert) {
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}{{f.control}}{{/form-field}}
  `);
  assert.equal(this.$('input[type="text"]').length, 1);
});

test('A custom form control can be specified', function(assert) {
  this.render(hbs`
    {{#form-field object "givenName" control="form-controls/search-input" as |f|}}
      {{f.control}}
    {{/form-field}}
  `);
  assert.equal(this.$('input[type="search"]').length, 1);
});

test('It sets the "for" attr of the label and the "id" attr of the input', function(assert) {
  let expectedId = `${guidFor(this.get('object'))}_givenName`;
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}
      {{f.label}}{{f.control}}
    {{/form-field}}
  `);
  assert.equal(this.$('label').attr('for'), expectedId);
  assert.equal(this.$('input').attr('id'), expectedId);
});

test('It uses the form property as fieldId if possible', function(assert) {
  let expectedId = `form123_givenName`;
  this.render(hbs`
    {{#form-field object "givenName" form="form123" as |f|}}
      {{f.label}}{{f.control}}
    {{/form-field}}
  `);
  assert.equal(this.$('label').attr('for'), expectedId);
  assert.equal(this.$('input').attr('id'), expectedId);
});

test('It sets the "name" attribute of input', function(assert) {
  let expectedName = `${guidFor(this.get('object'))}[givenName]`;
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}{{f.control}}{{/form-field}}
  `);
  assert.equal(this.$('input').attr('name'), expectedName);
});

test('Property modelName is used in the "name" attribute if present on object', function(assert) {
  this.set('object.modelName', 'person');
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}{{f.control}}{{/form-field}}
  `);
  assert.equal(this.$('input').attr('name'), 'person[givenName]');
});

test('It sets the value of the input to the value of the propertyName on object', function(assert) {
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}{{f.control}}{{/form-field}}
  `);
  assert.equal(this.$('input').val(), this.get('object.givenName'));
});

test('It passes the form attribute to the label and control', function(assert) {
  this.render(hbs`
    {{#form-field object "givenName" form="form123" as |f|}}
      {{f.label}}{{f.control}}
    {{/form-field}}
  `);
  assert.equal(this.$('label').attr('form'), 'form123');
  assert.equal(this.$('input').attr('form'), 'form123');
});

test('By default changing the input updates the value', function(assert) {
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}
      {{f.label}}{{f.control}}
    {{/form-field}}
  `);
  this.$('input').val('Mark').trigger('change');
  assert.equal(this.get('object.givenName'), 'Mark');
});

test('A custom update action can be passed', function(assert) {
  assert.expect(1);
  this.on('update', (object, propertyPath, value) => assert.equal(value, 'Mark'));
  this.render(hbs`
    {{#form-field object "givenName" update=(action 'update') as |f|}}
      {{f.label}}{{f.control}}
    {{/form-field}}
  `);
  this.$('input').val('Mark').trigger('change');
});

test('It can yield the labelText', function(assert) {
  this.render(hbs`
    {{#form-field object "givenName" as |f|}}
      {{f.labelText}}
    {{/form-field}}
  `);
  assert.equal(this.$().text().trim(), 'Given name');
});
