import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import Checkbox from '../../checkbox/index';

export default class App extends WidgetBase {
	private _checkboxStates: { [key: string]: boolean } = {
		c1: true,
		c2: false,
		c3: false,
		c4: false,
		c5: true
	};

	onChange(value: string, checked: boolean) {
		this._checkboxStates[value] = checked;
		this.invalidate();
	}

	render() {
		const { c1 = true, c2 = false, c3 = false } = this._checkboxStates;

		return v('div', [
			v('h2', {
				innerHTML: 'Checkbox Examples'
			}),
			v('fieldset', [
				v('legend', {}, ['Checkbox Example']),
				v('div', { id: 'example-1' }, [
					w(Checkbox, {
						key: 'c1',
						checked: c1,
						label: 'Sample checkbox that starts checked',
						onValue: (checked) => {
							this.onChange('c1', checked);
						}
					})
				]),

				v('div', { id: 'example-2' }, [
					w(Checkbox, {
						key: 'c2',
						checked: c2,
						label: 'Sample disabled checkbox',
						disabled: true,
						onValue: (checked) => {
							this.onChange('c2', checked);
						}
					})
				]),

				v('div', { id: 'example-3' }, [
					w(Checkbox, {
						key: 'c3',
						checked: c3,
						label: 'Required checkbox',
						required: true,
						onValue: (checked) => {
							this.onChange('c3', checked);
						}
					})
				])
			])
		]);
	}
}
