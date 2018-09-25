import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import Icon from '../../icon/index';
import Chips, { Chip } from '../index';

const type = [
	'Extra Soft',
	'Soft',
	'Medium',
	'Hard'
];

export default class App extends WidgetBase {
	private _selectedType = '';

	render() {
		return v('div', [
			v('h2', {
				innerHTML: 'Input Chip Examples'
			}),
			w(Chips, {
				key: 'test',
				chips: [
					'Just text',
					{
						leading: w(Icon, { type: 'plusIcon' }),
						content: 'with Icon'
					},
					{
						content: 'Selected',
						selected: true
					}
				]
			}),
			v('h2', {}, ['Choices']),
			w(Chips, {
				key: 'choices',
				chips: type.map(type => ({
					content: type,
					key: type,
					selected: this._selectedType === type
				})),
				onClick: (chip: Chip) => {
					this._selectedType = chip.key || '';
					this.invalidate();
				}
			})
		]);
	}
}
