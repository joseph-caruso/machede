#!/bin/sh
PAPEROS_DIR=/paperos
MACHEDE_DIR=/paperos/machede
MACHEDE_START_SCRIPT=/bin/machede

# Delete pre-existing version
if [ -d "$MACHEDE_DIR" ]; then
    printf '%s\n' "Removing Lock ($MACHEDE_DIR)"
    rm -rf "$MACHEDE_DIR"
fi

mkdir -p $PAPEROS_DIR
cp -r . $MACHEDE_DIR

cp $MACHEDE_DIR/scripts/start.sh $MACHEDE_START_SCRIPT
chmod +x $MACHEDE_START_SCRIPT
