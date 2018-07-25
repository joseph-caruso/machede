#!/bin/bash
/usr/bin/ratpoison &

export LIBOVERLAY_SCROLLBAR=0
export GTK_OVERLAY_SCROLLING=0

TERMINAL=`who | awk '{print $2}'`

if test -z "$DBUS_SESSION_BUS_ADDRESS" ; then
  eval 'dbus-launch --sh-syntax --exit-with-session'
fi

rm -Rf ~/.config/google-chrome
dbus-launch npm start
rm -Rf ~/.config/google-chrome

kill `ps | grep dbus-launch | grep -v grep | awk '{print $1}'`
