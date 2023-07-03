import {spawn} from 'node:child_process';
import React, {useEffect} from 'react';
import {Text, Box} from 'ink';
import Spinner from 'ink-spinner';
import {type InstallFeatureProps} from './interface.js';
import {blokeCmsPackageDirName, workingDirectory} from './constants.js';

export default function Dependencies({
	step,
	margin,
	onComplete,
	onError,
}: InstallFeatureProps) {
	const install = () => {
		spawn('npm', ['run', 'install'], {
			cwd: `${workingDirectory}/${blokeCmsPackageDirName}`,
		})
			.on('exit', (code, signal) => {
				if (code === 0) {
					onComplete(step);
					return;
				}

				const errorMessageCode = code ?? 'unknown';
				const errorMessageSignal = signal ?? 'unknown';
				const errorMessage = `Could not install dependencies, code: ${errorMessageCode}, signal: ${errorMessageSignal}.`;

				onError(errorMessage);
			})
			.on('error', error => {
				onError(error);
			});
	};

	useEffect(install, [onComplete, onError, step]);

	return (
		<Box marginRight={margin}>
			<Text>
				<Text color="green">
					<Spinner type="dots" />
				</Text>
				{' Installing dependencies, this might take a minute or few...'}
			</Text>
		</Box>
	);
}
