import { registerWorkbenchContribution2, WorkbenchPhase, IWorkbenchContribution } from '../../common/contributions.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';

class FlashaCodeContribution implements IWorkbenchContribution {
  constructor(
    @IInstantiationService private readonly instantiationService: IInstantiationService
  ) {
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
