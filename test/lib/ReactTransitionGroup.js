import React from 'zreact-compat';
import ReactTransitionGroup from '../../lib/ReactTransitionGroup';

describe('ReactFragment', () => {
	it('should export .create', () => {
		expect(ReactTransitionGroup).to.be.a.function;
	});
});
