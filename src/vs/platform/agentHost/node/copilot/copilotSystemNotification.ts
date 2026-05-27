/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { SessionEventPayload } from '@github/copilot-sdk';
import { localize } from '../../../../nls.js';

export interface ICopilotSystemNotification {
	readonly message: string;
	readonly label: string;
}

export function buildCopilotSystemNotification(event: SessionEventPayload<'system.notification'>): ICopilotSystemNotification | undefined {
	const data = event.data;
	const kind = data.kind;
	const message = cleanSystemNotificationContent(data.content);
	if (!message) {
		return undefined;
	}

	switch (kind.type) {
		case 'shell_completed':
		case 'shell_detached_completed': {
			const description = kind.description;
			const shellId = kind.shellId;
			return {
				message,
				label: description
					? localize('agentHost.copilot.systemNotification.shellDescriptionCompleted', "`{0}` completed", description)
					: shellId
						? localize('agentHost.copilot.systemNotification.shellIdCompleted', "Shell `{0}` completed", shellId)
						: localize('agentHost.copilot.systemNotification.shellCompleted', "Shell completed"),
			};
		}
		case 'agent_completed':
			return {
				message,
				label: localize('agentHost.copilot.systemNotification.agentCompleted', "Background agent completed"),
			};
		default:
			return undefined;
	}
}

function cleanSystemNotificationContent(content: string): string {
	const trimmed = content.trim();
	const match = /^<system_notification>\s*([\s\S]*?)\s*<\/system_notification>$/.exec(trimmed);
	return (match?.[1] ?? trimmed).trim();
}
