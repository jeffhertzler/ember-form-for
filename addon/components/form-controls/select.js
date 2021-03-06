import Ember from 'ember';
import layout from '../../templates/components/form-controls/select';

import { invokeAction } from 'ember-invoke-action';

const {
  computed,
  computed: { alias },
  get,
  set,
  String: { w }
} = Ember;

const SelectComponent =  Ember.Component.extend({
  layout,
  tagName: 'select',

  attributeBindings: [
    'accesskey',
    'autofocus',
    'dir',
    'disabled',
    'form',
    'hidden',
    'lang',
    'multiple',
    'name',
    'required',
    'size',
    'tabindex',
    'title'
  ],

  didReceiveAttrs() {
    this._super(...arguments);

    let options = this.getAttr('options');
    if (typeof options === 'string') {
      options = w(options);
    }

    set(this, 'options', Ember.A(options));
  },

  optionGroups: computed('options.[]', function() {
    const groupLabelPath = get(this, 'groupLabelPath');
    const options        = get(this, 'options');
    const groups         = Ember.A();

    if (!groupLabelPath) {
      return;
    }

    options.forEach((item) => {
      const label = get(item, groupLabelPath);

      if (label) {
        let group = groups.findBy('groupName', label);

        if (group == null) {
          group = Ember.Object.create({
            groupName: label,
            options:   Ember.A()
          });

          groups.pushObject(group);
        }

        get(group, 'options').pushObject(item);
      } else {
        groups.pushObject(item);
      }
    });

    return groups;
  }),

  change() {
    let value;

    if (get(this, 'multiple') === true) {
      value = this._selectedMultiple();
    } else {
      value = this._selectedSingle();
    }

    invokeAction(this, 'update', value);
  },

  prompt: alias('includeBlank'),

  promptText: computed('prompt', function() {
    let includeBlank = get(this, 'includeBlank');
    if (typeof includeBlank === 'string') {
      return includeBlank;
    }
  }),

  _selectedMultiple() {
    let selectedValues = this.$().val();

    return selectedValues.map((selectedValue) => {
      return this._findOption(selectedValue);
    });
  },

  _selectedSingle() {
    let selectedValue = this.$().val();
    return this._findOption(selectedValue);
  },

  _findOption(value) {
    let options = get(this, 'options');
    let optionValuePath = get(this, 'optionValuePath');

    return options.find((item) => {
      if (optionValuePath) {
        return `${get(item, optionValuePath)}` === value;
      } else {
        return `${item}` === value;
      }
    });
  }
});

SelectComponent.reopenClass({
  positionalParams: ['value']
});

export default SelectComponent;
