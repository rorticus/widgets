import { v, w } from '@dojo/framework/core/vdom';
import { expect } from 'chai';

import harness from '@dojo/framework/testing/harness';
import { describe, it } from 'mocha';
import { isNotFocusedComparator, noop } from '../../../common/tests/support/test-helpers';
import * as css from '../../../theme/button.m.css';
import Button from '../../index';

describe('Button', () => {
	const compareFocusFalse = {
		selector: 'button',
		property: 'focus',
		comparator: isNotFocusedComparator
	};

	it('renders without content', () => {
		const h = harness(() => w(Button, {}), [compareFocusFalse]);
		h.expect(() =>
			v(
				'button',
				{
					'aria-pressed': null,
					classes: [css.root, null, null],
					disabled: undefined,
					id: undefined,
					name: undefined,
					focus: noop,
					onblur: noop,
					onclick: noop,
					onfocus: noop,
					type: undefined,
					value: undefined,
					onpointerenter: noop,
					onpointerleave: noop,
					onpointerdown: noop,
					onpointerup: noop
				},
				[null]
			)
		);
		expect(h).not.to.be.undefined;
	});
});
