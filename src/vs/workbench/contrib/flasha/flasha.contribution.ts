import { registerWorkbenchContribution2, WorkbenchPhase } from '../../common/contributions.js';

class FlashaCodeContribution {
  constructor() {
    this.init();
  }

  private init(): void {
    console.log('[Flasha Code] Contribution loaded');
  }
}

registerWorkbenchContribution2(
  'flasha.code',
  FlashaCodeContribution,
  WorkbenchPhase.BlockStartup
);
