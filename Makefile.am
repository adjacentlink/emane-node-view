EXTRA_DIST= \
 m4 \
 AUTHORS \
 INSTALL \
 NEWS \
 ChangeLog \
 COPYING \
 README.md \
 README \
 autogen.sh \
 setup.py.in \
 scripts \
 MANIFEST.in \
 install-virtualenv.sh \
 emane_node_view \
 images

all-local: setup.py emane_node_view/static/bundle.js emane_node_view/static/node_modules
	$(PYTHON) setup.py build_ext --inplace
	$(PYTHON) setup.py build

clean-local: setup.py
	$(PYTHON) setup.py clean
	-rm -rf build
	-rm -rf dist
	-find . -name "*.pyc" -delete
	-rm -f .installedfiles
	-rm -f $(PACKAGE)-*.tar.gz
	-rm -rf emane_node_view.egg-info
	-rm -f emane_node_view/static/bundle.js
	-rm -rf emane_node_view/static/node_modules

dist-hook:
	-rm -f $(distdir)/emane_node_view/static/bundle.js
	-rm -rf $(distdir)/emane_node_view/static/node_modules

DISTCLEANFILES=setup.py

edit = sed \
        -e 's|@VERSION[@]|$(VERSION)|g'

setup.py:	setup.py.in
	if test -f $@; then chmod u+w $@; fi
	$(edit) $< > $@
	chmod g-w,u-w $@

install-exec-hook: $(BUILT_SOURCES)
	$(PYTHON) setup.py install \
	    -O1 \
        --record .installedfiles \
	    --prefix=$(prefix) \
	    --exec-prefix=$(exec_prefix) \
	    $(if $(DESTDIR),--root=$(DESTDIR))

uninstall-hook:
	if test -f .installedfiles; then xargs -a .installedfiles rm -f; fi

emane_node_view/static/bundle.js: emane_node_view/static/app.js emane_node_view/static/node_modules
	browserify $< -o $@

emane_node_view/static/node_modules:
	cd emane_node_view/static && npm update

