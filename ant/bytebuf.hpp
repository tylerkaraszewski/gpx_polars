#include <cstdio>
#include <string>
#include <list>
#include <fstream>
#include <iostream>

// From: https://stackoverflow.com/questions/7781898/get-an-istream-from-a-char

class bytebuf : public std::streambuf
{
public:
    bytebuf(const uint8_t *begin, const size_t size);

private:
    int_type underflow();
    int_type uflow();
    int_type pbackfail(int_type ch);
    std::streamsize showmanyc();
    std::streampos seekoff ( std::streamoff off, std::ios_base::seekdir way,
                            std::ios_base::openmode which = std::ios_base::in | std::ios_base::out );
    std::streampos seekpos ( std::streampos sp,
                            std::ios_base::openmode which = std::ios_base::in | std::ios_base::out);

    // copy ctor and assignment not implemented;
    // copying not allowed
    bytebuf(const bytebuf &);
    bytebuf &operator= (const bytebuf &);

private:
    const uint8_t * const begin_;
    const uint8_t * const end_;
    const uint8_t * current_;
};
