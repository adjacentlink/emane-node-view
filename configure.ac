%AC_COPYRIGHT([
 Copyright (c) 2019,2021-2022 - Adjacent Link LLC, Bridgewater,
 New Jersey
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 
 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in
   the documentation and/or other materials provided with the
   distribution.
 * Neither the name of Adjacent Link LLC nor the names of its
   contributors may be used to endorse or promote products derived
   from this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.

 See toplevel COPYING for more information.
])

AC_INIT([emane-node-view],0.2.4,[labs at adjacentlink dot com])

AC_CONFIG_SRCDIR([emane_node_view])

AC_CONFIG_MACRO_DIR([m4])

AM_INIT_AUTOMAKE([tar-ustar])

AC_PROG_INSTALL

AM_PATH_PYTHON([2.7])

AC_CHECK_PROG(NPM_CHECK,npm,yes)
AS_IF([test x"$NPM_CHECK" != x"yes"],
 [AC_MSG_ERROR([Please install npm before configuring.])])

AC_CHECK_PROG(BROWSERIFY_CHECK,browserify,yes)
AS_IF([test x"$BROWSERIFY_CHECK" != x"yes"],
 [AC_MSG_ERROR([Please install browserify before configuring.])])

LANG=C
AC_SUBST(LANG)

AC_OUTPUT(
 Makefile
)
