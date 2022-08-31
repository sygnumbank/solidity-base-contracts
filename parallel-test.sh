#!/bin/bash
FAIL=0
i=0

test_files=(`find test -name \*.test.js`)

for (( j = 0; j < "${#test_files[@]}"; j+=4 )) do
    npx hardhat test ${test_files[${j}]} ${test_files[$((j+1))]} ${test_files[$((j+2))]} ${test_files[$((j+3))]} &> hardhat_test_$j`echo $f | tr / _` &
done
    
for job in $(jobs -p); do
    wait $job || let "FAIL+=1"
done

if [ "$FAIL" == "0" ]; then
    echo "Tests ran in parallel successfully!"
else
    echo "Some tests failed. See hardhat_test_<dirname> for details."
    exit 1
fi
