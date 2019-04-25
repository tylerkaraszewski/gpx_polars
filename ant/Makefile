CPP = $(shell find . -name '*.cpp')

decode.js: $(CPP)
	em++ -O1 --std=c++14 $(CPP) -o decode.js -Icpp -s EXPORTED_FUNCTIONS='["_decode_fit"]' -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'
