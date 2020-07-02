#!/bin/sh

# code goes here.
echo "This is a script, run by cron!"

truffle exec scripts/synthetix.js --network $NETWORK
