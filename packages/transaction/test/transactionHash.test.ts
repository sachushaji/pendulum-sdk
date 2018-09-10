import test from 'ava'
import { trits } from '@helix/converter'
import { bundle, bundleTrytes } from '@helix/samples'
import { transactionHash } from '../src'

test('transactionHash() returns the correct transaction hash.', t => {
    t.is(
        transactionHash(trits(bundleTrytes[0])),
        bundle[0].hash,
        'transactionHash() should return the correct transaction hash.'
    )
})
