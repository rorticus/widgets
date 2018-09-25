import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import {
	CustomAriaProperties,
	KeyEventProperties,
	PointerEventProperties
} from '../common/interfaces';
import { v } from '@dojo/framework/widget-core/d';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import * as css from '../theme/chips.m.css';

export interface Chip {
	key?: string;
	leading?: DNode;
	content: DNode;
	trailing?: DNode;
	selected?: boolean;
}

export interface ChipsProperties extends ThemedProperties, KeyEventProperties, PointerEventProperties, CustomAriaProperties {
	chips: (Chip | DNode)[];
	onClick?: (chip: Chip) => void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

function isChipDefinition(chip: any): chip is Chip {
	return !!chip.content;
}

@theme(css)
@customElement<ChipsProperties>({
	tag: 'dojo-chips',
	properties: [],
	attributes: [],
	events: []
})
export class ChipsBase<P extends ChipsProperties = ChipsProperties> extends ThemedBase<P, null> {
	protected getRootClasses(): (string | null)[] {
		const {} = this.properties;

		return [
			css.root
		];
	}

	protected _onClick(chip: Chip) {
		this.properties.onClick && this.properties.onClick(chip);
	}

	protected _renderChip(chip: Chip): DNode {
		const { selected = false, content, leading } = chip;

		return v('div', {
			tabIndex: 0,
			classes: this.theme([css.chip, selected ? css.selected : undefined]),
			onclick: () => this._onClick(chip)
		}, [
			leading,
			content
		]);
	}

	protected render(): DNode {
		const { chips } = this.properties;

		return v('div', {
			key: 'root',
			classes: this.theme(this.getRootClasses())
		}, chips.map(chip => this._renderChip(isChipDefinition(chip) ? chip : { content: chip })));
	}
}

export default class Chips extends ChipsBase<ChipsProperties> {}
