echo "\ncompiling circuits..."
for d in circuits/*/ ; do
  cd $d
  pwd
  nargo compile
  cd ../..
done
