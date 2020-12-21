const { processBranchString } = require('../index');

describe('Branch parser', () => {
  it('should handle blank inputs', () => {
    expect(processBranchString('', '')).toBe(undefined);
    expect(processBranchString('', 'Fixing bug with my code')).toBe(undefined);
  });
  it('should handle branches without Jira tags', () => {
    expect(processBranchString('master', '')).toBe(undefined);
    expect(processBranchString('master', 'Fixing bug with my code')).toBe(undefined);
    expect(processBranchString('main', '')).toBe(undefined);
    expect(processBranchString('main', 'Fixing bug with my code')).toBe(undefined);
    expect(processBranchString('develop', '')).toBe(undefined);
    expect(processBranchString('develop', 'Fixing bug with my code')).toBe(undefined);
    expect(processBranchString('patch-1', '')).toBe(undefined);
    expect(processBranchString('patch-1', 'Fixing bug with my code')).toBe(undefined);
    expect(processBranchString('feature/EXPO-update', '')).toBe(undefined);
    expect(processBranchString('feature/EXPO-update', 'Fixing bug with my code')).toBe(undefined);
  });
  it('should handle single Jira ticket branches', () => {
    expect(processBranchString('feature/ABC-123-new-btn', '')).toBe('[ABC-123]');
    expect(processBranchString('feature/ABC-123-new-btn', 'Adding a new btn')).toBe(
      '[ABC-123] Adding a new btn',
    );
  });
  it('should handle multiple Jira ticket branches', () => {
    expect(processBranchString('feature/ABC-123-FUN-456-new-btn', '')).toBe('[ABC-123] [FUN-456]');
    expect(processBranchString('feature/ABC-123-FUN-456-new-btn', 'Adding a new btn')).toBe(
      '[ABC-123] [FUN-456] Adding a new btn',
    );
    expect(processBranchString('feature/FUN-456-ABC-123-new-btn', 'Adding a new btn')).toBe(
      '[ABC-123] [FUN-456] Adding a new btn',
    );
    expect(processBranchString('fix/FUN-456-ABC-123-ME-789-new-btn', 'Fixing the big bug')).toBe(
      '[ABC-123] [FUN-456] [ME-789] Fixing the big bug',
    );
    expect(
      processBranchString('fix/FUN-456-ABC-123-ME-789-MYFUNAPP-101-new-btn', 'Adding a new btn'),
    ).toBe('[ABC-123] [FUN-456] [ME-789] [MYFUNAPP-101] Adding a new btn');
  });
  it("shouldn't combine tags", () => {
    expect(processBranchString('feature/ABC-123-new-btn', '[ABC-123]')).toBe('[ABC-123]');
    expect(processBranchString('feature/ABC-123-new-btn', '[ABC-123] Adding a new btn')).toBe(
      '[ABC-123] Adding a new btn',
    );
    expect(
      processBranchString(
        'fix/FUN-456-ABC-123-ME-789-MYFUNAPP-101-new-btn',
        '[ABC-123] [FUN-456] [ME-789] [MYFUNAPP-101]',
      ),
    ).toBe('[ABC-123] [FUN-456] [ME-789] [MYFUNAPP-101]');
    expect(
      processBranchString(
        'fix/FUN-456-ABC-123-ME-789-MYFUNAPP-101-new-btn',
        '[ABC-123] [FUN-456] [ME-789] [MYFUNAPP-101] Adding a new btn',
      ),
    ).toBe('[ABC-123] [FUN-456] [ME-789] [MYFUNAPP-101] Adding a new btn');
  });
});
