
/*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.pako = {}));
})(this, (function (exports) { 'use strict';

  // Note: adler32 takes 12% for level 0 and 2% for level 6.
  // It isn't worth it to make additional optimizations as in original.
  // Small size is preferable.

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  const adler32 = (adler, buf, len, pos) => {
    let s1 = (adler & 0xffff) |0,
        s2 = ((adler >>> 16) & 0xffff) |0,
        n = 0;

    while (len !== 0) {
      // Set limit ~ twice less than 5552, to keep
      // s2 in 31-bits, because we force signed ints.
      // in other case %= will fail.
      n = len > 2000 ? 2000 : len;
      len -= n;

      do {
        s1 = (s1 + buf[pos++]) |0;
        s2 = (s2 + s1) |0;
      } while (--n);

      s1 %= 65521;
      s2 %= 65521;
    }

    return (s1 | (s2 << 16)) |0;
  };


  var adler32_1 = adler32;

  // Note: we can't get significant speed boost here.
  // So write code to minimize size - no pregenerated tables
  // and array tools dependencies.

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  // Use ordinary array, since untyped makes no boost here
  const makeTable = () => {
    let c, table = [];

    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c;
    }

    return table;
  };

  // Create table on load. Just 255 signed longs. Not a problem.
  const crcTable = new Uint32Array(makeTable());


  const crc32 = (crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;

    crc ^= -1;

    for (let i = pos; i < end; i++) {
      crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
    }

    return (crc ^ (-1)); // >>> 0;
  };


  var crc32_1 = crc32;

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  // See state defs from inflate.js
  const BAD$1 = 16209;       /* got a data error -- remain here until reset */
  const TYPE$1 = 16191;      /* i: waiting for type bits, including last-flag bit */

  /*
     Decode literal, length, and distance codes and write out the resulting
     literal and match bytes until either not enough input or output is
     available, an end-of-block is encountered, or a data error is encountered.
     When large enough input and output buffers are supplied to inflate(), for
     example, a 16K input buffer and a 64K output buffer, more than 95% of the
     inflate execution time is spent in this routine.

     Entry assumptions:

          state.mode === LEN
          strm.avail_in >= 6
          strm.avail_out >= 258
          start >= strm.avail_out
          state.bits < 8

     On return, state.mode is one of:

          LEN -- ran out of enough output space or enough available input
          TYPE -- reached end of block code, inflate() to interpret next block
          BAD -- error in block data

     Notes:

      - The maximum input bits used by a length/distance pair is 15 bits for the
        length code, 5 bits for the length extra, 15 bits for the distance code,
        and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
        Therefore if strm.avail_in >= 6, then there is enough input to avoid
        checking for available input while decoding.

      - The maximum bytes that a single length/distance pair can output is 258
        bytes, which is the maximum length that can be coded.  inflate_fast()
        requires strm.avail_out >= 258 for each loop to avoid checking for
        output space.
   */
  var inffast = function inflate_fast(strm, start) {
    let _in;                    /* local strm.input */
    let last;                   /* have enough input while in < last */
    let _out;                   /* local strm.output */
    let beg;                    /* inflate()'s initial strm.output */
    let end;                    /* while out < end, enough space available */
  //#ifdef INFLATE_STRICT
    let dmax;                   /* maximum distance from zlib header */
  //#endif
    let wsize;                  /* window size or zero if not using window */
    let whave;                  /* valid bytes in the window */
    let wnext;                  /* window write index */
    // Use `s_window` instead `window`, avoid conflict with instrumentation tools
    let s_window;               /* allocated sliding window, if wsize != 0 */
    let hold;                   /* local strm.hold */
    let bits;                   /* local strm.bits */
    let lcode;                  /* local strm.lencode */
    let dcode;                  /* local strm.distcode */
    let lmask;                  /* mask for first level of length codes */
    let dmask;                  /* mask for first level of distance codes */
    let here;                   /* retrieved table entry */
    let op;                     /* code bits, operation, extra bits, or */
                                /*  window position, window bytes to copy */
    let len;                    /* match length, unused bytes */
    let dist;                   /* match distance */
    let from;                   /* where to copy match from */
    let from_source;


    let input, output; // JS specific, because we have no pointers

    /* copy state to local variables */
    const state = strm.state;
    //here = state.here;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
  //#ifdef INFLATE_STRICT
    dmax = state.dmax;
  //#endif
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;


    /* decode literals and length/distances until end-of-block or not enough
       input data or output space */

    top:
    do {
      if (bits < 15) {
        hold += input[_in++] << bits;
        bits += 8;
        hold += input[_in++] << bits;
        bits += 8;
      }

      here = lcode[hold & lmask];

      dolen:
      for (;;) { // Goto emulation
        op = here >>> 24/*here.bits*/;
        hold >>>= op;
        bits -= op;
        op = (here >>> 16) & 0xff/*here.op*/;
        if (op === 0) {                          /* literal */
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          output[_out++] = here & 0xffff/*here.val*/;
        }
        else if (op & 16) {                     /* length base */
          len = here & 0xffff/*here.val*/;
          op &= 15;                           /* number of extra bits */
          if (op) {
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
            }
            len += hold & ((1 << op) - 1);
            hold >>>= op;
            bits -= op;
          }
          //Tracevv((stderr, "inflate:         length %u\n", len));
          if (bits < 15) {
            hold += input[_in++] << bits;
            bits += 8;
            hold += input[_in++] << bits;
            bits += 8;
          }
          here = dcode[hold & dmask];

          dodist:
          for (;;) { // goto emulation
            op = here >>> 24/*here.bits*/;
            hold >>>= op;
            bits -= op;
            op = (here >>> 16) & 0xff/*here.op*/;

            if (op & 16) {                      /* distance base */
              dist = here & 0xffff/*here.val*/;
              op &= 15;                       /* number of extra bits */
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
              }
              dist += hold & ((1 << op) - 1);
  //#ifdef INFLATE_STRICT
              if (dist > dmax) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD$1;
                break top;
              }
  //#endif
              hold >>>= op;
              bits -= op;
              //Tracevv((stderr, "inflate:         distance %u\n", dist));
              op = _out - beg;                /* max distance in output */
              if (dist > op) {                /* see if copy from window */
                op = dist - op;               /* distance back in window */
                if (op > whave) {
                  if (state.sane) {
                    strm.msg = 'invalid distance too far back';
                    state.mode = BAD$1;
                    break top;
                  }

  // (!) This block is disabled in zlib defaults,
  // don't enable it for binary compatibility
  //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
  //                if (len <= op - whave) {
  //                  do {
  //                    output[_out++] = 0;
  //                  } while (--len);
  //                  continue top;
  //                }
  //                len -= op - whave;
  //                do {
  //                  output[_out++] = 0;
  //                } while (--op > whave);
  //                if (op === 0) {
  //                  from = _out - dist;
  //                  do {
  //                    output[_out++] = output[from++];
  //                  } while (--len);
  //                  continue top;
  //                }
  //#endif
                }
                from = 0; // window index
                from_source = s_window;
                if (wnext === 0) {           /* very common case */
                  from += wsize - op;
                  if (op < len) {         /* some from window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;  /* rest from output */
                    from_source = output;
                  }
                }
                else if (wnext < op) {      /* wrap around window */
                  from += wsize + wnext - op;
                  op -= wnext;
                  if (op < len) {         /* some from end of window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = 0;
                    if (wnext < len) {  /* some from start of window */
                      op = wnext;
                      len -= op;
                      do {
                        output[_out++] = s_window[from++];
                      } while (--op);
                      from = _out - dist;      /* rest from output */
                      from_source = output;
                    }
                  }
                }
                else {                      /* contiguous in window */
                  from += wnext - op;
                  if (op < len) {         /* some from window */
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;  /* rest from output */
                    from_source = output;
                  }
                }
                while (len > 2) {
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  output[_out++] = from_source[from++];
                  len -= 3;
                }
                if (len) {
                  output[_out++] = from_source[from++];
                  if (len > 1) {
                    output[_out++] = from_source[from++];
                  }
                }
              }
              else {
                from = _out - dist;          /* copy direct from output */
                do {                        /* minimum length is three */
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  output[_out++] = output[from++];
                  len -= 3;
                } while (len > 2);
                if (len) {
                  output[_out++] = output[from++];
                  if (len > 1) {
                    output[_out++] = output[from++];
                  }
                }
              }
            }
            else if ((op & 64) === 0) {          /* 2nd level distance code */
              here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
              continue dodist;
            }
            else {
              strm.msg = 'invalid distance code';
              state.mode = BAD$1;
              break top;
            }

            break; // need to emulate goto via "continue"
          }
        }
        else if ((op & 64) === 0) {              /* 2nd level length code */
          here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
          continue dolen;
        }
        else if (op & 32) {                     /* end-of-block */
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.mode = TYPE$1;
          break top;
        }
        else {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD$1;
          break top;
        }

        break; // need to emulate goto via "continue"
      }
    } while (_in < last && _out < end);

    /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;

    /* update state and return */
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
    strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
    state.hold = hold;
    state.bits = bits;
    return;
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  const MAXBITS = 15;
  const ENOUGH_LENS$1 = 852;
  const ENOUGH_DISTS$1 = 592;
  //const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

  const CODES$1 = 0;
  const LENS$1 = 1;
  const DISTS$1 = 2;

  const lbase = new Uint16Array([ /* Length codes 257..285 base */
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
    35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
  ]);

  const lext = new Uint8Array([ /* Length codes 257..285 extra */
    16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
    19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
  ]);

  const dbase = new Uint16Array([ /* Distance codes 0..29 base */
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
    257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
    8193, 12289, 16385, 24577, 0, 0
  ]);

  const dext = new Uint8Array([ /* Distance codes 0..29 extra */
    16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
    23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
    28, 28, 29, 29, 64, 64
  ]);

  const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
  {
    const bits = opts.bits;
        //here = opts.here; /* table entry for duplication */

    let len = 0;               /* a code's length in bits */
    let sym = 0;               /* index of code symbols */
    let min = 0, max = 0;          /* minimum and maximum code lengths */
    let root = 0;              /* number of index bits for root table */
    let curr = 0;              /* number of index bits for current table */
    let drop = 0;              /* code bits to drop for sub-table */
    let left = 0;                   /* number of prefix codes available */
    let used = 0;              /* code entries in table used */
    let huff = 0;              /* Huffman code */
    let incr;              /* for incrementing code, index */
    let fill;              /* index for replicating entries */
    let low;               /* low bits for current root entry */
    let mask;              /* mask for low root bits */
    let next;             /* next available space in table */
    let base = null;     /* base value table to use */
  //  let shoextra;    /* extra bits table to use */
    let match;                  /* use base and extra for symbol >= match */
    const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
    const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
    let extra = null;

    let here_bits, here_op, here_val;

    /*
     Process a set of code lengths to create a canonical Huffman code.  The
     code lengths are lens[0..codes-1].  Each length corresponds to the
     symbols 0..codes-1.  The Huffman code is generated by first sorting the
     symbols by length from short to long, and retaining the symbol order
     for codes with equal lengths.  Then the code starts with all zero bits
     for the first code of the shortest length, and the codes are integer
     increments for the same length, and zeros are appended as the length
     increases.  For the deflate format, these bits are stored backwards
     from their more natural integer increment ordering, and so when the
     decoding tables are built in the large loop below, the integer codes
     are incremented backwards.

     This routine assumes, but does not check, that all of the entries in
     lens[] are in the range 0..MAXBITS.  The caller must assure this.
     1..MAXBITS is interpreted as that code length.  zero means that that
     symbol does not occur in this code.

     The codes are sorted by computing a count of codes for each length,
     creating from that a table of starting indices for each length in the
     sorted table, and then entering the symbols in order in the sorted
     table.  The sorted table is work[], with that space being provided by
     the caller.

     The length counts are used for other purposes as well, i.e. finding
     the minimum and maximum length codes, determining if there are any
     codes at all, checking for a valid set of lengths, and looking ahead
     at length counts to determine sub-table sizes when building the
     decoding tables.
     */

    /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }

    /* bound code lengths, force root to be within code lengths */
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) { break; }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {                     /* no symbols to code at all */
      //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
      //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
      //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
      table[table_index++] = (1 << 24) | (64 << 16) | 0;


      //table.op[opts.table_index] = 64;
      //table.bits[opts.table_index] = 1;
      //table.val[opts.table_index++] = 0;
      table[table_index++] = (1 << 24) | (64 << 16) | 0;

      opts.bits = 1;
      return 0;     /* no symbols, but wait for decoding to report error */
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) { break; }
    }
    if (root < min) {
      root = min;
    }

    /* check for an over-subscribed or incomplete set of lengths */
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }        /* over-subscribed */
    }
    if (left > 0 && (type === CODES$1 || max !== 1)) {
      return -1;                      /* incomplete set */
    }

    /* generate offsets into symbol table for each length for sorting */
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }

    /* sort symbols by length, by symbol order within each length */
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }

    /*
     Create and fill in decoding tables.  In this loop, the table being
     filled is at next and has curr index bits.  The code being used is huff
     with length len.  That code is converted to an index by dropping drop
     bits off of the bottom.  For codes where len is less than drop + curr,
     those top drop + curr - len bits are incremented through all values to
     fill the table with replicated entries.

     root is the number of index bits for the root table.  When len exceeds
     root, sub-tables are created pointed to by the root entry with an index
     of the low root bits of huff.  This is saved in low to check for when a
     new sub-table should be started.  drop is zero when the root table is
     being filled, and drop is root when sub-tables are being filled.

     When a new sub-table is needed, it is necessary to look ahead in the
     code lengths to determine what size sub-table is needed.  The length
     counts are used for this, and so count[] is decremented as codes are
     entered in the tables.

     used keeps track of how many table entries have been allocated from the
     provided *table space.  It is checked for LENS and DIST tables against
     the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
     the initial root table size constants.  See the comments in inftrees.h
     for more information.

     sym increments through all symbols, and the loop terminates when
     all codes of length max, i.e. all codes, have been processed.  This
     routine permits incomplete codes, so another loop after this one fills
     in the rest of the decoding tables with invalid code markers.
     */

    /* set up for code type */
    // poor man optimization - use if-else instead of switch,
    // to avoid deopts in old v8
    if (type === CODES$1) {
      base = extra = work;    /* dummy value--not used */
      match = 20;

    } else if (type === LENS$1) {
      base = lbase;
      extra = lext;
      match = 257;

    } else {                    /* DISTS */
      base = dbase;
      extra = dext;
      match = 0;
    }

    /* initialize opts for loop */
    huff = 0;                   /* starting code */
    sym = 0;                    /* starting code symbol */
    len = min;                  /* starting code length */
    next = table_index;              /* current table to fill in */
    curr = root;                /* current table index bits */
    drop = 0;                   /* current bits to drop from code for index */
    low = -1;                   /* trigger new sub-table when len > root */
    used = 1 << root;          /* use root table entries */
    mask = used - 1;            /* mask for comparing low */

    /* check available table space */
    if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
      (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
      return 1;
    }

    /* process all codes and make table entries */
    for (;;) {
      /* create table entry */
      here_bits = len - drop;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      }
      else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base[work[sym] - match];
      }
      else {
        here_op = 32 + 64;         /* end of block */
        here_val = 0;
      }

      /* replicate for those indices with low len bits equal to huff */
      incr = 1 << (len - drop);
      fill = 1 << curr;
      min = fill;                 /* save offset to next table */
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
      } while (fill !== 0);

      /* backwards increment the len-bit code huff */
      incr = 1 << (len - 1);
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }

      /* go to next symbol, update count, len */
      sym++;
      if (--count[len] === 0) {
        if (len === max) { break; }
        len = lens[lens_index + work[sym]];
      }

      /* create new sub-table if needed */
      if (len > root && (huff & mask) !== low) {
        /* if first time, transition to sub-tables */
        if (drop === 0) {
          drop = root;
        }

        /* increment past last table */
        next += min;            /* here min is 1 << curr */

        /* determine length of next table */
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) { break; }
          curr++;
          left <<= 1;
        }

        /* check for enough space */
        used += 1 << curr;
        if ((type === LENS$1 && used > ENOUGH_LENS$1) ||
          (type === DISTS$1 && used > ENOUGH_DISTS$1)) {
          return 1;
        }

        /* point entry in root table to sub-table */
        low = huff & mask;
        /*table.op[low] = curr;
        table.bits[low] = root;
        table.val[low] = next - opts.table_index;*/
        table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
      }
    }

    /* fill in remaining table entry if code is incomplete (guaranteed to have
     at most one remaining entry, since if the code is incomplete, the
     maximum code length that was allowed to get this far is one bit) */
    if (huff !== 0) {
      //table.op[next + huff] = 64;            /* invalid code marker */
      //table.bits[next + huff] = len - drop;
      //table.val[next + huff] = 0;
      table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
    }

    /* set return parameters */
    //opts.table_index += used;
    opts.bits = root;
    return 0;
  };


  var inftrees = inflate_table;

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  var constants$1 = {

    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH:         0,
    Z_PARTIAL_FLUSH:    1,
    Z_SYNC_FLUSH:       2,
    Z_FULL_FLUSH:       3,
    Z_FINISH:           4,
    Z_BLOCK:            5,
    Z_TREES:            6,

    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK:               0,
    Z_STREAM_END:       1,
    Z_NEED_DICT:        2,
    Z_ERRNO:           -1,
    Z_STREAM_ERROR:    -2,
    Z_DATA_ERROR:      -3,
    Z_MEM_ERROR:       -4,
    Z_BUF_ERROR:       -5,
    //Z_VERSION_ERROR: -6,

    /* compression levels */
    Z_NO_COMPRESSION:         0,
    Z_BEST_SPEED:             1,
    Z_BEST_COMPRESSION:       9,
    Z_DEFAULT_COMPRESSION:   -1,


    Z_FILTERED:               1,
    Z_HUFFMAN_ONLY:           2,
    Z_RLE:                    3,
    Z_FIXED:                  4,
    Z_DEFAULT_STRATEGY:       0,

    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY:                 0,
    Z_TEXT:                   1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN:                2,

    /* The deflate compression method */
    Z_DEFLATED:               8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.






  const CODES = 0;
  const LENS = 1;
  const DISTS = 2;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  const {
    Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES,
    Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR,
    Z_DEFLATED
  } = constants$1;


  /* STATES ====================================================================*/
  /* ===========================================================================*/


  const    HEAD = 16180;       /* i: waiting for magic header */
  const    FLAGS = 16181;      /* i: waiting for method and flags (gzip) */
  const    TIME = 16182;       /* i: waiting for modification time (gzip) */
  const    OS = 16183;         /* i: waiting for extra flags and operating system (gzip) */
  const    EXLEN = 16184;      /* i: waiting for extra length (gzip) */
  const    EXTRA = 16185;      /* i: waiting for extra bytes (gzip) */
  const    NAME = 16186;       /* i: waiting for end of file name (gzip) */
  const    COMMENT = 16187;    /* i: waiting for end of comment (gzip) */
  const    HCRC = 16188;       /* i: waiting for header crc (gzip) */
  const    DICTID = 16189;    /* i: waiting for dictionary check value */
  const    DICT = 16190;      /* waiting for inflateSetDictionary() call */
  const        TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */
  const        TYPEDO = 16192;    /* i: same, but skip check to exit inflate on new block */
  const        STORED = 16193;    /* i: waiting for stored size (length and complement) */
  const        COPY_ = 16194;     /* i/o: same as COPY below, but only first time in */
  const        COPY = 16195;      /* i/o: waiting for input or output to copy stored block */
  const        TABLE = 16196;     /* i: waiting for dynamic block table lengths */
  const        LENLENS = 16197;   /* i: waiting for code length code lengths */
  const        CODELENS = 16198;  /* i: waiting for length/lit and distance code lengths */
  const            LEN_ = 16199;      /* i: same as LEN below, but only first time in */
  const            LEN = 16200;       /* i: waiting for length/lit/eob code */
  const            LENEXT = 16201;    /* i: waiting for length extra bits */
  const            DIST = 16202;      /* i: waiting for distance code */
  const            DISTEXT = 16203;   /* i: waiting for distance extra bits */
  const            MATCH = 16204;     /* o: waiting for output space to copy string */
  const            LIT = 16205;       /* o: waiting for output space to write literal */
  const    CHECK = 16206;     /* i: waiting for 32-bit check value */
  const    LENGTH = 16207;    /* i: waiting for 32-bit length (gzip) */
  const    DONE = 16208;      /* finished check, done -- remain here until reset */
  const    BAD = 16209;       /* got a data error -- remain here until reset */
  const    MEM = 16210;       /* got an inflate() memory error -- remain here until reset */
  const    SYNC = 16211;      /* looking for synchronization bytes to restart inflate() */

  /* ===========================================================================*/



  const ENOUGH_LENS = 852;
  const ENOUGH_DISTS = 592;
  //const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

  const MAX_WBITS = 15;
  /* 32K LZ77 window */
  const DEF_WBITS = MAX_WBITS;


  const zswap32 = (q) => {

    return  (((q >>> 24) & 0xff) +
            ((q >>> 8) & 0xff00) +
            ((q & 0xff00) << 8) +
            ((q & 0xff) << 24));
  };


  function InflateState() {
    this.strm = null;           /* pointer back to this zlib stream */
    this.mode = 0;              /* current inflate mode */
    this.last = false;          /* true if processing last block */
    this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip,
                                   bit 2 true to validate check value */
    this.havedict = false;      /* true if dictionary provided */
    this.flags = 0;             /* gzip header method and flags (0 if zlib), or
                                   -1 if raw or no header yet */
    this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
    this.check = 0;             /* protected copy of check value */
    this.total = 0;             /* protected copy of output count */
    // TODO: may be {}
    this.head = null;           /* where to save gzip header information */

    /* sliding window */
    this.wbits = 0;             /* log base 2 of requested window size */
    this.wsize = 0;             /* window size or zero if not using window */
    this.whave = 0;             /* valid bytes in the window */
    this.wnext = 0;             /* window write index */
    this.window = null;         /* allocated sliding window, if needed */

    /* bit accumulator */
    this.hold = 0;              /* input bit accumulator */
    this.bits = 0;              /* number of bits in "in" */

    /* for string and stored block copying */
    this.length = 0;            /* literal or length of data to copy */
    this.offset = 0;            /* distance back to copy string from */

    /* for table and code decoding */
    this.extra = 0;             /* extra bits needed */

    /* fixed and dynamic code tables */
    this.lencode = null;          /* starting table for length/literal codes */
    this.distcode = null;         /* starting table for distance codes */
    this.lenbits = 0;           /* index bits for lencode */
    this.distbits = 0;          /* index bits for distcode */

    /* dynamic table building */
    this.ncode = 0;             /* number of code length code lengths */
    this.nlen = 0;              /* number of length code lengths */
    this.ndist = 0;             /* number of distance code lengths */
    this.have = 0;              /* number of code lengths in lens[] */
    this.next = null;              /* next available space in codes[] */

    this.lens = new Uint16Array(320); /* temporary storage for code lengths */
    this.work = new Uint16Array(288); /* work area for code table building */

    /*
     because we don't have pointers in js, we use lencode and distcode directly
     as buffers so we don't need codes
    */
    //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
    this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
    this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
    this.sane = 0;                   /* if false, allow invalid distance too far */
    this.back = 0;                   /* bits back of last unprocessed length/lit */
    this.was = 0;                    /* initial length of match */
  }


  const inflateStateCheck = (strm) => {

    if (!strm) {
      return 1;
    }
    const state = strm.state;
    if (!state || state.strm !== strm ||
      state.mode < HEAD || state.mode > SYNC) {
      return 1;
    }
    return 0;
  };


  const inflateResetKeep = (strm) => {

    if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = ''; /*Z_NULL*/
    if (state.wrap) {       /* to support ill-conceived Java test suite */
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null/*Z_NULL*/;
    state.hold = 0;
    state.bits = 0;
    //state.lencode = state.distcode = state.next = state.codes;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);

    state.sane = 1;
    state.back = -1;
    //Tracev((stderr, "inflate: reset\n"));
    return Z_OK$1;
  };


  const inflateReset = (strm) => {

    if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);

  };


  const inflateReset2 = (strm, windowBits) => {
    let wrap;

    /* get the state */
    if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
    const state = strm.state;

    /* extract wrap request from windowBits parameter */
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    }
    else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }

    /* set number of window bits, free window if different */
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }

    /* update state and reset the rest of it */
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  };


  const inflateInit2 = (strm, windowBits) => {

    if (!strm) { return Z_STREAM_ERROR$1; }
    //strm.msg = Z_NULL;                 /* in case we return an error */

    const state = new InflateState();

    //if (state === Z_NULL) return Z_MEM_ERROR;
    //Tracev((stderr, "inflate: allocated\n"));
    strm.state = state;
    state.strm = strm;
    state.window = null/*Z_NULL*/;
    state.mode = HEAD;     /* to pass state test in inflateReset2() */
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null/*Z_NULL*/;
    }
    return ret;
  };


  const inflateInit = (strm) => {

    return inflateInit2(strm, DEF_WBITS);
  };


  /*
   Return state with length and distance decoding tables and index sizes set to
   fixed code decoding.  Normally this returns fixed tables from inffixed.h.
   If BUILDFIXED is defined, then instead this routine builds the tables the
   first time it's called, and returns those tables the first time and
   thereafter.  This reduces the size of the code by about 2K bytes, in
   exchange for a little execution time.  However, BUILDFIXED should not be
   used for threaded applications, since the rewriting of the tables and virgin
   may not be thread-safe.
   */
  let virgin = true;

  let lenfix, distfix; // We have no pointers in JS, so keep tables separate


  const fixedtables = (state) => {

    /* build fixed huffman tables if first call (may not be thread safe) */
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);

      /* literal/length table */
      let sym = 0;
      while (sym < 144) { state.lens[sym++] = 8; }
      while (sym < 256) { state.lens[sym++] = 9; }
      while (sym < 280) { state.lens[sym++] = 7; }
      while (sym < 288) { state.lens[sym++] = 8; }

      inftrees(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

      /* distance table */
      sym = 0;
      while (sym < 32) { state.lens[sym++] = 5; }

      inftrees(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

      /* do this just once */
      virgin = false;
    }

    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  };


  /*
   Update the window with the last wsize (normally 32K) bytes written before
   returning.  If window does not exist yet, create it.  This is only called
   when a window is already in use, or when output has been written during this
   inflate call, but the end of the deflate stream has not been reached yet.
   It is also called to create a window for dictionary data when a dictionary
   is loaded.

   Providing output buffers larger than 32K to inflate() should provide a speed
   advantage, since only the last 32K of output is copied to the sliding window
   upon return from inflate(), and since all distances after the first 32K of
   output will fall in the output data, making match copies simpler and faster.
   The advantage may be dependent on the size of the processor's data caches.
   */
  const updatewindow = (strm, src, end, copy) => {

    let dist;
    const state = strm.state;

    /* if it hasn't been done already, allocate space for the window */
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;

      state.window = new Uint8Array(state.wsize);
    }

    /* copy state->wsize or less output bytes into the circular window */
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    }
    else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      //zmemcpy(state->window + state->wnext, end - copy, dist);
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        //zmemcpy(state->window, end - copy, copy);
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      }
      else {
        state.wnext += dist;
        if (state.wnext === state.wsize) { state.wnext = 0; }
        if (state.whave < state.wsize) { state.whave += dist; }
      }
    }
    return 0;
  };


  const inflate$1 = (strm, flush) => {

    let state;
    let input, output;          // input/output buffers
    let next;                   /* next input INDEX */
    let put;                    /* next output INDEX */
    let have, left;             /* available input and output */
    let hold;                   /* bit buffer */
    let bits;                   /* bits in bit buffer */
    let _in, _out;              /* save starting available input and output */
    let copy;                   /* number of stored or match bytes to copy */
    let from;                   /* where to copy match bytes from */
    let from_source;
    let here = 0;               /* current decoding table entry */
    let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
    //let last;                   /* parent table entry */
    let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
    let len;                    /* length to copy for repeats, bits to drop */
    let ret;                    /* return code */
    const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
    let opts;

    let n; // temporary variable for NEED_BITS

    const order = /* permutation of code lengths */
      new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


    if (inflateStateCheck(strm) || !strm.output ||
        (!strm.input && strm.avail_in !== 0)) {
      return Z_STREAM_ERROR$1;
    }

    state = strm.state;
    if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


    //--- LOAD() ---
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    //---

    _in = have;
    _out = left;
    ret = Z_OK$1;

    inf_leave: // goto emulation
    for (;;) {
      switch (state.mode) {
        case HEAD:
          if (state.wrap === 0) {
            state.mode = TYPEDO;
            break;
          }
          //=== NEEDBITS(16);
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
            if (state.wbits === 0) {
              state.wbits = 15;
            }
            state.check = 0/*crc32(0L, Z_NULL, 0)*/;
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//

            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            state.mode = FLAGS;
            break;
          }
          if (state.head) {
            state.head.done = false;
          }
          if (!(state.wrap & 1) ||   /* check if zlib header allowed */
            (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
            strm.msg = 'incorrect header check';
            state.mode = BAD;
            break;
          }
          if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
          len = (hold & 0x0f)/*BITS(4)*/ + 8;
          if (state.wbits === 0) {
            state.wbits = len;
          }
          if (len > 15 || len > state.wbits) {
            strm.msg = 'invalid window size';
            state.mode = BAD;
            break;
          }

          // !!! pako patch. Force use `options.windowBits` if passed.
          // Required to always use max window size by default.
          state.dmax = 1 << state.wbits;
          //state.dmax = 1 << len;

          state.flags = 0;               /* indicate zlib header */
          //Tracev((stderr, "inflate:   zlib header ok\n"));
          strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
          state.mode = hold & 0x200 ? DICTID : TYPE;
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          break;
        case FLAGS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.flags = hold;
          if ((state.flags & 0xff) !== Z_DEFLATED) {
            strm.msg = 'unknown compression method';
            state.mode = BAD;
            break;
          }
          if (state.flags & 0xe000) {
            strm.msg = 'unknown header flags set';
            state.mode = BAD;
            break;
          }
          if (state.head) {
            state.head.text = ((hold >> 8) & 1);
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = TIME;
          /* falls through */
        case TIME:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.time = hold;
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC4(state.check, hold)
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            hbuf[2] = (hold >>> 16) & 0xff;
            hbuf[3] = (hold >>> 24) & 0xff;
            state.check = crc32_1(state.check, hbuf, 4, 0);
            //===
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = OS;
          /* falls through */
        case OS:
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if (state.head) {
            state.head.xflags = (hold & 0xff);
            state.head.os = (hold >> 8);
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32_1(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = EXLEN;
          /* falls through */
        case EXLEN:
          if (state.flags & 0x0400) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length = hold;
            if (state.head) {
              state.head.extra_len = hold;
            }
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              //=== CRC2(state.check, hold);
              hbuf[0] = hold & 0xff;
              hbuf[1] = (hold >>> 8) & 0xff;
              state.check = crc32_1(state.check, hbuf, 2, 0);
              //===//
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          }
          else if (state.head) {
            state.head.extra = null/*Z_NULL*/;
          }
          state.mode = EXTRA;
          /* falls through */
        case EXTRA:
          if (state.flags & 0x0400) {
            copy = state.length;
            if (copy > have) { copy = have; }
            if (copy) {
              if (state.head) {
                len = state.head.extra_len - state.length;
                if (!state.head.extra) {
                  // Use untyped array for more convenient processing later
                  state.head.extra = new Uint8Array(state.head.extra_len);
                }
                state.head.extra.set(
                  input.subarray(
                    next,
                    // extra field is limited to 65536 bytes
                    // - no need for additional size check
                    next + copy
                  ),
                  /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                  len
                );
                //zmemcpy(state.head.extra + len, next,
                //        len + copy > state.head.extra_max ?
                //        state.head.extra_max - len : copy);
              }
              if ((state.flags & 0x0200) && (state.wrap & 4)) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              state.length -= copy;
            }
            if (state.length) { break inf_leave; }
          }
          state.length = 0;
          state.mode = NAME;
          /* falls through */
        case NAME:
          if (state.flags & 0x0800) {
            if (have === 0) { break inf_leave; }
            copy = 0;
            do {
              // TODO: 2 or 1 bytes?
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len &&
                  (state.length < 65536 /*state.head.name_max*/)) {
                state.head.name += String.fromCharCode(len);
              }
            } while (len && copy < have);

            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) { break inf_leave; }
          }
          else if (state.head) {
            state.head.name = null;
          }
          state.length = 0;
          state.mode = COMMENT;
          /* falls through */
        case COMMENT:
          if (state.flags & 0x1000) {
            if (have === 0) { break inf_leave; }
            copy = 0;
            do {
              len = input[next + copy++];
              /* use constant limit because in js we should not preallocate memory */
              if (state.head && len &&
                  (state.length < 65536 /*state.head.comm_max*/)) {
                state.head.comment += String.fromCharCode(len);
              }
            } while (len && copy < have);
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32_1(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            if (len) { break inf_leave; }
          }
          else if (state.head) {
            state.head.comment = null;
          }
          state.mode = HCRC;
          /* falls through */
        case HCRC:
          if (state.flags & 0x0200) {
            //=== NEEDBITS(16); */
            while (bits < 16) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if ((state.wrap & 4) && hold !== (state.check & 0xffff)) {
              strm.msg = 'header crc mismatch';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
          }
          if (state.head) {
            state.head.hcrc = ((state.flags >> 9) & 1);
            state.head.done = true;
          }
          strm.adler = state.check = 0;
          state.mode = TYPE;
          break;
        case DICTID:
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          strm.adler = state.check = zswap32(hold);
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = DICT;
          /* falls through */
        case DICT:
          if (state.havedict === 0) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            return Z_NEED_DICT$1;
          }
          strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
          state.mode = TYPE;
          /* falls through */
        case TYPE:
          if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case TYPEDO:
          if (state.last) {
            //--- BYTEBITS() ---//
            hold >>>= bits & 7;
            bits -= bits & 7;
            //---//
            state.mode = CHECK;
            break;
          }
          //=== NEEDBITS(3); */
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.last = (hold & 0x01)/*BITS(1)*/;
          //--- DROPBITS(1) ---//
          hold >>>= 1;
          bits -= 1;
          //---//

          switch ((hold & 0x03)/*BITS(2)*/) {
            case 0:                             /* stored block */
              //Tracev((stderr, "inflate:     stored block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = STORED;
              break;
            case 1:                             /* fixed block */
              fixedtables(state);
              //Tracev((stderr, "inflate:     fixed codes block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = LEN_;             /* decode codes */
              if (flush === Z_TREES) {
                //--- DROPBITS(2) ---//
                hold >>>= 2;
                bits -= 2;
                //---//
                break inf_leave;
              }
              break;
            case 2:                             /* dynamic block */
              //Tracev((stderr, "inflate:     dynamic codes block%s\n",
              //        state.last ? " (last)" : ""));
              state.mode = TABLE;
              break;
            case 3:
              strm.msg = 'invalid block type';
              state.mode = BAD;
          }
          //--- DROPBITS(2) ---//
          hold >>>= 2;
          bits -= 2;
          //---//
          break;
        case STORED:
          //--- BYTEBITS() ---// /* go to byte boundary */
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          //=== NEEDBITS(32); */
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
            strm.msg = 'invalid stored block lengths';
            state.mode = BAD;
            break;
          }
          state.length = hold & 0xffff;
          //Tracev((stderr, "inflate:       stored length %u\n",
          //        state.length));
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = COPY_;
          if (flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case COPY_:
          state.mode = COPY;
          /* falls through */
        case COPY:
          copy = state.length;
          if (copy) {
            if (copy > have) { copy = have; }
            if (copy > left) { copy = left; }
            if (copy === 0) { break inf_leave; }
            //--- zmemcpy(put, next, copy); ---
            output.set(input.subarray(next, next + copy), put);
            //---//
            have -= copy;
            next += copy;
            left -= copy;
            put += copy;
            state.length -= copy;
            break;
          }
          //Tracev((stderr, "inflate:       stored end\n"));
          state.mode = TYPE;
          break;
        case TABLE:
          //=== NEEDBITS(14); */
          while (bits < 14) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
          //--- DROPBITS(5) ---//
          hold >>>= 5;
          bits -= 5;
          //---//
          state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
          //--- DROPBITS(4) ---//
          hold >>>= 4;
          bits -= 4;
          //---//
  //#ifndef PKZIP_BUG_WORKAROUND
          if (state.nlen > 286 || state.ndist > 30) {
            strm.msg = 'too many length or distance symbols';
            state.mode = BAD;
            break;
          }
  //#endif
          //Tracev((stderr, "inflate:       table sizes ok\n"));
          state.have = 0;
          state.mode = LENLENS;
          /* falls through */
        case LENLENS:
          while (state.have < state.ncode) {
            //=== NEEDBITS(3);
            while (bits < 3) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
            //--- DROPBITS(3) ---//
            hold >>>= 3;
            bits -= 3;
            //---//
          }
          while (state.have < 19) {
            state.lens[order[state.have++]] = 0;
          }
          // We have separate tables & no pointers. 2 commented lines below not needed.
          //state.next = state.codes;
          //state.lencode = state.next;
          // Switch to use dynamic table
          state.lencode = state.lendyn;
          state.lenbits = 7;

          opts = { bits: state.lenbits };
          ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
          state.lenbits = opts.bits;

          if (ret) {
            strm.msg = 'invalid code lengths set';
            state.mode = BAD;
            break;
          }
          //Tracev((stderr, "inflate:       code lengths ok\n"));
          state.have = 0;
          state.mode = CODELENS;
          /* falls through */
        case CODELENS:
          while (state.have < state.nlen + state.ndist) {
            for (;;) {
              here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;

              if ((here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            if (here_val < 16) {
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              state.lens[state.have++] = here_val;
            }
            else {
              if (here_val === 16) {
                //=== NEEDBITS(here.bits + 2);
                n = here_bits + 2;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                if (state.have === 0) {
                  strm.msg = 'invalid bit length repeat';
                  state.mode = BAD;
                  break;
                }
                len = state.lens[state.have - 1];
                copy = 3 + (hold & 0x03);//BITS(2);
                //--- DROPBITS(2) ---//
                hold >>>= 2;
                bits -= 2;
                //---//
              }
              else if (here_val === 17) {
                //=== NEEDBITS(here.bits + 3);
                n = here_bits + 3;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 3 + (hold & 0x07);//BITS(3);
                //--- DROPBITS(3) ---//
                hold >>>= 3;
                bits -= 3;
                //---//
              }
              else {
                //=== NEEDBITS(here.bits + 7);
                n = here_bits + 7;
                while (bits < n) {
                  if (have === 0) { break inf_leave; }
                  have--;
                  hold += input[next++] << bits;
                  bits += 8;
                }
                //===//
                //--- DROPBITS(here.bits) ---//
                hold >>>= here_bits;
                bits -= here_bits;
                //---//
                len = 0;
                copy = 11 + (hold & 0x7f);//BITS(7);
                //--- DROPBITS(7) ---//
                hold >>>= 7;
                bits -= 7;
                //---//
              }
              if (state.have + copy > state.nlen + state.ndist) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              while (copy--) {
                state.lens[state.have++] = len;
              }
            }
          }

          /* handle error breaks in while */
          if (state.mode === BAD) { break; }

          /* check for end-of-block code (better have one) */
          if (state.lens[256] === 0) {
            strm.msg = 'invalid code -- missing end-of-block';
            state.mode = BAD;
            break;
          }

          /* build code tables -- note: do not change the lenbits or distbits
             values here (9 and 6) without reading the comments in inftrees.h
             concerning the ENOUGH constants, which depend on those values */
          state.lenbits = 9;

          opts = { bits: state.lenbits };
          ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.lenbits = opts.bits;
          // state.lencode = state.next;

          if (ret) {
            strm.msg = 'invalid literal/lengths set';
            state.mode = BAD;
            break;
          }

          state.distbits = 6;
          //state.distcode.copy(state.codes);
          // Switch to use dynamic table
          state.distcode = state.distdyn;
          opts = { bits: state.distbits };
          ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
          // We have separate tables & no pointers. 2 commented lines below not needed.
          // state.next_index = opts.table_index;
          state.distbits = opts.bits;
          // state.distcode = state.next;

          if (ret) {
            strm.msg = 'invalid distances set';
            state.mode = BAD;
            break;
          }
          //Tracev((stderr, 'inflate:       codes ok\n'));
          state.mode = LEN_;
          if (flush === Z_TREES) { break inf_leave; }
          /* falls through */
        case LEN_:
          state.mode = LEN;
          /* falls through */
        case LEN:
          if (have >= 6 && left >= 258) {
            //--- RESTORE() ---
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            //---
            inffast(strm, _out);
            //--- LOAD() ---
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            //---

            if (state.mode === TYPE) {
              state.back = -1;
            }
            break;
          }
          state.back = 0;
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if (here_bits <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_op && (here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.lencode[last_val +
                      ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;

              if ((last_bits + here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          state.length = here_val;
          if (here_op === 0) {
            //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
            //        "inflate:         literal '%c'\n" :
            //        "inflate:         literal 0x%02x\n", here.val));
            state.mode = LIT;
            break;
          }
          if (here_op & 32) {
            //Tracevv((stderr, "inflate:         end of block\n"));
            state.back = -1;
            state.mode = TYPE;
            break;
          }
          if (here_op & 64) {
            strm.msg = 'invalid literal/length code';
            state.mode = BAD;
            break;
          }
          state.extra = here_op & 15;
          state.mode = LENEXT;
          /* falls through */
        case LENEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
          //Tracevv((stderr, "inflate:         length %u\n", state.length));
          state.was = state.length;
          state.mode = DIST;
          /* falls through */
        case DIST:
          for (;;) {
            here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if ((here_op & 0xf0) === 0) {
            last_bits = here_bits;
            last_op = here_op;
            last_val = here_val;
            for (;;) {
              here = state.distcode[last_val +
                      ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
              here_bits = here >>> 24;
              here_op = (here >>> 16) & 0xff;
              here_val = here & 0xffff;

              if ((last_bits + here_bits) <= bits) { break; }
              //--- PULLBYTE() ---//
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
              //---//
            }
            //--- DROPBITS(last.bits) ---//
            hold >>>= last_bits;
            bits -= last_bits;
            //---//
            state.back += last_bits;
          }
          //--- DROPBITS(here.bits) ---//
          hold >>>= here_bits;
          bits -= here_bits;
          //---//
          state.back += here_bits;
          if (here_op & 64) {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break;
          }
          state.offset = here_val;
          state.extra = (here_op) & 15;
          state.mode = DISTEXT;
          /* falls through */
        case DISTEXT:
          if (state.extra) {
            //=== NEEDBITS(state.extra);
            n = state.extra;
            while (bits < n) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
            //--- DROPBITS(state.extra) ---//
            hold >>>= state.extra;
            bits -= state.extra;
            //---//
            state.back += state.extra;
          }
  //#ifdef INFLATE_STRICT
          if (state.offset > state.dmax) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
  //#endif
          //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
          state.mode = MATCH;
          /* falls through */
        case MATCH:
          if (left === 0) { break inf_leave; }
          copy = _out - left;
          if (state.offset > copy) {         /* copy from window */
            copy = state.offset - copy;
            if (copy > state.whave) {
              if (state.sane) {
                strm.msg = 'invalid distance too far back';
                state.mode = BAD;
                break;
              }
  // (!) This block is disabled in zlib defaults,
  // don't enable it for binary compatibility
  //#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
  //          Trace((stderr, "inflate.c too far\n"));
  //          copy -= state.whave;
  //          if (copy > state.length) { copy = state.length; }
  //          if (copy > left) { copy = left; }
  //          left -= copy;
  //          state.length -= copy;
  //          do {
  //            output[put++] = 0;
  //          } while (--copy);
  //          if (state.length === 0) { state.mode = LEN; }
  //          break;
  //#endif
            }
            if (copy > state.wnext) {
              copy -= state.wnext;
              from = state.wsize - copy;
            }
            else {
              from = state.wnext - copy;
            }
            if (copy > state.length) { copy = state.length; }
            from_source = state.window;
          }
          else {                              /* copy from output */
            from_source = output;
            from = put - state.offset;
            copy = state.length;
          }
          if (copy > left) { copy = left; }
          left -= copy;
          state.length -= copy;
          do {
            output[put++] = from_source[from++];
          } while (--copy);
          if (state.length === 0) { state.mode = LEN; }
          break;
        case LIT:
          if (left === 0) { break inf_leave; }
          output[put++] = state.length;
          left--;
          state.mode = LEN;
          break;
        case CHECK:
          if (state.wrap) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) { break inf_leave; }
              have--;
              // Use '|' instead of '+' to make sure that result is signed
              hold |= input[next++] << bits;
              bits += 8;
            }
            //===//
            _out -= left;
            strm.total_out += _out;
            state.total += _out;
            if ((state.wrap & 4) && _out) {
              strm.adler = state.check =
                  /*UPDATE_CHECK(state.check, put - _out, _out);*/
                  (state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out));

            }
            _out = left;
            // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
            if ((state.wrap & 4) && (state.flags ? hold : zswap32(hold)) !== state.check) {
              strm.msg = 'incorrect data check';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   check matches trailer\n"));
          }
          state.mode = LENGTH;
          /* falls through */
        case LENGTH:
          if (state.wrap && state.flags) {
            //=== NEEDBITS(32);
            while (bits < 32) {
              if (have === 0) { break inf_leave; }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            //===//
            if ((state.wrap & 4) && hold !== (state.total & 0xffffffff)) {
              strm.msg = 'incorrect length check';
              state.mode = BAD;
              break;
            }
            //=== INITBITS();
            hold = 0;
            bits = 0;
            //===//
            //Tracev((stderr, "inflate:   length matches trailer\n"));
          }
          state.mode = DONE;
          /* falls through */
        case DONE:
          ret = Z_STREAM_END$1;
          break inf_leave;
        case BAD:
          ret = Z_DATA_ERROR$1;
          break inf_leave;
        case MEM:
          return Z_MEM_ERROR$1;
        case SYNC:
          /* falls through */
        default:
          return Z_STREAM_ERROR$1;
      }
    }

    // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

    /*
       Return from inflate(), updating the total counts and the check value.
       If there was no progress during the inflate() call, return a buffer
       error.  Call updatewindow() to create and/or update the window state.
       Note: a memory error from inflate() is non-recoverable.
     */

    //--- RESTORE() ---
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    //---

    if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                        (state.mode < CHECK || flush !== Z_FINISH$1))) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if ((state.wrap & 4) && _out) {
      strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
        (state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out));
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) +
                      (state.mode === TYPE ? 128 : 0) +
                      (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if (((_in === 0 && _out === 0) || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  };


  const inflateEnd = (strm) => {

    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }

    let state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  };


  const inflateGetHeader = (strm, head) => {

    /* check state */
    if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
    const state = strm.state;
    if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR$1; }

    /* save header structure */
    state.head = head;
    head.done = false;
    return Z_OK$1;
  };


  const inflateSetDictionary = (strm, dictionary) => {
    const dictLength = dictionary.length;

    let state;
    let dictid;
    let ret;

    /* check state */
    if (inflateStateCheck(strm)) { return Z_STREAM_ERROR$1; }
    state = strm.state;

    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }

    /* check for correct dictionary identifier */
    if (state.mode === DICT) {
      dictid = 1; /* adler32(0, null, 0)*/
      /* dictid = adler32(dictid, dictionary, dictLength); */
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    /* copy dictionary to window using updatewindow(), which will amend the
     existing dictionary if appropriate */
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    // Tracev((stderr, "inflate:   dictionary set\n"));
    return Z_OK$1;
  };


  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2$1 = inflate$1;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = 'pako inflate (from Nodeca project)';

  /* Not implemented
  module.exports.inflateCodesUsed = inflateCodesUsed;
  module.exports.inflateCopy = inflateCopy;
  module.exports.inflateGetDictionary = inflateGetDictionary;
  module.exports.inflateMark = inflateMark;
  module.exports.inflatePrime = inflatePrime;
  module.exports.inflateSync = inflateSync;
  module.exports.inflateSyncPoint = inflateSyncPoint;
  module.exports.inflateUndermine = inflateUndermine;
  module.exports.inflateValidate = inflateValidate;
  */

  var inflate_1$1 = {
  	inflateReset: inflateReset_1,
  	inflateReset2: inflateReset2_1,
  	inflateResetKeep: inflateResetKeep_1,
  	inflateInit: inflateInit_1,
  	inflateInit2: inflateInit2_1,
  	inflate: inflate_2$1,
  	inflateEnd: inflateEnd_1,
  	inflateGetHeader: inflateGetHeader_1,
  	inflateSetDictionary: inflateSetDictionary_1,
  	inflateInfo: inflateInfo
  };

  const _has = (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  var assign = function (obj /*from1, from2, from3, ...*/) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) { continue; }

      if (typeof source !== 'object') {
        throw new TypeError(source + 'must be non-object');
      }

      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }

    return obj;
  };


  // Join array of chunks to single array.
  var flattenChunks = (chunks) => {
    // calculate data length
    let len = 0;

    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }

    // join chunks
    const result = new Uint8Array(len);

    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  };

  var common = {
  	assign: assign,
  	flattenChunks: flattenChunks
  };

  // String encode/decode helpers


  // Quick check if we can use fast array to bin string conversion
  //
  // - apply(Array) can fail on Android 2.2
  // - apply(Uint8Array) can fail on iOS 5.1 Safari
  //
  let STR_APPLY_UIA_OK = true;

  try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


  // Table with utf8 lengths (calculated by first byte of sequence)
  // Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
  // because max possible codepoint is 0x10ffff
  const _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
  }
  _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


  // convert string to array (typed, when possible)
  var string2buf = (str) => {
    if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }

    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

    // count binary size
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
    }

    // allocate buffer
    buf = new Uint8Array(buf_len);

    // convert
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 0xfc00) === 0xdc00) {
          c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
          m_pos++;
        }
      }
      if (c < 0x80) {
        /* one byte */
        buf[i++] = c;
      } else if (c < 0x800) {
        /* two bytes */
        buf[i++] = 0xC0 | (c >>> 6);
        buf[i++] = 0x80 | (c & 0x3f);
      } else if (c < 0x10000) {
        /* three bytes */
        buf[i++] = 0xE0 | (c >>> 12);
        buf[i++] = 0x80 | (c >>> 6 & 0x3f);
        buf[i++] = 0x80 | (c & 0x3f);
      } else {
        /* four bytes */
        buf[i++] = 0xf0 | (c >>> 18);
        buf[i++] = 0x80 | (c >>> 12 & 0x3f);
        buf[i++] = 0x80 | (c >>> 6 & 0x3f);
        buf[i++] = 0x80 | (c & 0x3f);
      }
    }

    return buf;
  };

  // Helper
  const buf2binstring = (buf, len) => {
    // On Chrome, the arguments in a function call that are allowed is `65534`.
    // If the length of the buffer is smaller than that, we can use this optimization,
    // otherwise we will take a slower path.
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }

    let result = '';
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  };


  // convert array to string
  var buf2string = (buf, max) => {
    const len = max || buf.length;

    if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }

    let i, out;

    // Reserve max possible length (2 words per char)
    // NB: by unknown reasons, Array is significantly faster for
    //     String.fromCharCode.apply than Uint16Array.
    const utf16buf = new Array(len * 2);

    for (out = 0, i = 0; i < len;) {
      let c = buf[i++];
      // quick process ascii
      if (c < 0x80) { utf16buf[out++] = c; continue; }

      let c_len = _utf8len[c];
      // skip 5 & 6 byte codes
      if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

      // apply mask on first byte
      c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
      // join the rest
      while (c_len > 1 && i < len) {
        c = (c << 6) | (buf[i++] & 0x3f);
        c_len--;
      }

      // terminated by end of string?
      if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

      if (c < 0x10000) {
        utf16buf[out++] = c;
      } else {
        c -= 0x10000;
        utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
        utf16buf[out++] = 0xdc00 | (c & 0x3ff);
      }
    }

    return buf2binstring(utf16buf, out);
  };


  // Calculate max possible position in utf8 buffer,
  // that will not break sequence. If that's not possible
  // - (very small limits) return max size as is.
  //
  // buf[] - utf8 bytes array
  // max   - length limit (mandatory);
  var utf8border = (buf, max) => {

    max = max || buf.length;
    if (max > buf.length) { max = buf.length; }

    // go back from last position, until start of sequence found
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

    // Very small and broken sequence,
    // return max, because we should return something anyway.
    if (pos < 0) { return max; }

    // If we came to start of buffer - that means buffer is too small,
    // return max too.
    if (pos === 0) { return max; }

    return (pos + _utf8len[buf[pos]] > max) ? pos : max;
  };

  var strings = {
  	string2buf: string2buf,
  	buf2string: buf2string,
  	utf8border: utf8border
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  var messages = {
    2:      'need dictionary',     /* Z_NEED_DICT       2  */
    1:      'stream end',          /* Z_STREAM_END      1  */
    0:      '',                    /* Z_OK              0  */
    '-1':   'file error',          /* Z_ERRNO         (-1) */
    '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
    '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
    '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
    '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
    '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
  };

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  function ZStream() {
    /* next input byte */
    this.input = null; // JS specific, because we have no pointers
    this.next_in = 0;
    /* number of bytes available at input */
    this.avail_in = 0;
    /* total number of input bytes read so far */
    this.total_in = 0;
    /* next output byte should be put there */
    this.output = null; // JS specific, because we have no pointers
    this.next_out = 0;
    /* remaining free space at output */
    this.avail_out = 0;
    /* total number of bytes output so far */
    this.total_out = 0;
    /* last error message, NULL if no error */
    this.msg = ''/*Z_NULL*/;
    /* not visible by applications */
    this.state = null;
    /* best guess about the data type: binary or text */
    this.data_type = 2/*Z_UNKNOWN*/;
    /* adler32 value of the uncompressed data */
    this.adler = 0;
  }

  var zstream = ZStream;

  // (C) 1995-2013 Jean-loup Gailly and Mark Adler
  // (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
  //
  // This software is provided 'as-is', without any express or implied
  // warranty. In no event will the authors be held liable for any damages
  // arising from the use of this software.
  //
  // Permission is granted to anyone to use this software for any purpose,
  // including commercial applications, and to alter it and redistribute it
  // freely, subject to the following restrictions:
  //
  // 1. The origin of this software must not be misrepresented; you must not
  //   claim that you wrote the original software. If you use this software
  //   in a product, an acknowledgment in the product documentation would be
  //   appreciated but is not required.
  // 2. Altered source versions must be plainly marked as such, and must not be
  //   misrepresented as being the original software.
  // 3. This notice may not be removed or altered from any source distribution.

  function GZheader() {
    /* true if compressed data believed to be text */
    this.text       = 0;
    /* modification time */
    this.time       = 0;
    /* extra flags (not used when writing a gzip file) */
    this.xflags     = 0;
    /* operating system */
    this.os         = 0;
    /* pointer to extra field or Z_NULL if none */
    this.extra      = null;
    /* extra field length (valid if extra != Z_NULL) */
    this.extra_len  = 0; // Actually, we don't need it in JS,
                         // but leave for few code modifications

    //
    // Setup limits is not necessary because in js we should not preallocate memory
    // for inflate use constant limit in 65536 bytes
    //

    /* space at extra (only when reading header) */
    // this.extra_max  = 0;
    /* pointer to zero-terminated file name or Z_NULL */
    this.name       = '';
    /* space at name (only when reading header) */
    // this.name_max   = 0;
    /* pointer to zero-terminated comment or Z_NULL */
    this.comment    = '';
    /* space at comment (only when reading header) */
    // this.comm_max   = 0;
    /* true if there was or will be a header crc */
    this.hcrc       = 0;
    /* true when done reading gzip header (not used when writing a gzip file) */
    this.done       = false;
  }

  var gzheader = GZheader;

  const toString = Object.prototype.toString;

  /* Public constants ==========================================================*/
  /* ===========================================================================*/

  const {
    Z_NO_FLUSH, Z_FINISH,
    Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR
  } = constants$1;

  /* ===========================================================================*/


  /**
   * class Inflate
   *
   * Generic JS-style wrapper for zlib calls. If you don't need
   * streaming behaviour - use more simple functions: [[inflate]]
   * and [[inflateRaw]].
   **/

  /* internal
   * inflate.chunks -> Array
   *
   * Chunks of output data, if [[Inflate#onData]] not overridden.
   **/

  /**
   * Inflate.result -> Uint8Array|String
   *
   * Uncompressed result, generated by default [[Inflate#onData]]
   * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
   * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
   **/

  /**
   * Inflate.err -> Number
   *
   * Error code after inflate finished. 0 (Z_OK) on success.
   * Should be checked if broken data possible.
   **/

  /**
   * Inflate.msg -> String
   *
   * Error message, if [[Inflate.err]] != 0
   **/


  /**
   * new Inflate(options)
   * - options (Object): zlib inflate options.
   *
   * Creates new inflator instance with specified params. Throws exception
   * on bad params. Supported options:
   *
   * - `windowBits`
   * - `dictionary`
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information on these.
   *
   * Additional options, for internal needs:
   *
   * - `chunkSize` - size of generated data chunks (16K by default)
   * - `raw` (Boolean) - do raw inflate
   * - `to` (String) - if equal to 'string', then result will be converted
   *   from utf8 to utf16 (javascript) string. When string output requested,
   *   chunk length can differ from `chunkSize`, depending on content.
   *
   * By default, when no options set, autodetect deflate/gzip data format via
   * wrapper header.
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako')
   * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
   * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
   *
   * const inflate = new pako.Inflate({ level: 3});
   *
   * inflate.push(chunk1, false);
   * inflate.push(chunk2, true);  // true -> last chunk
   *
   * if (inflate.err) { throw new Error(inflate.err); }
   *
   * console.log(inflate.result);
   * ```
   **/
  function Inflate(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ''
    }, options || {});

    const opt = this.options;

    // Force window size for `raw` data, if not set directly,
    // because we have no header for autodetect.
    if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) { opt.windowBits = -15; }
    }

    // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
    if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
        !(options && options.windowBits)) {
      opt.windowBits += 32;
    }

    // Gzip header has no info about windows size, we can do autodetect only
    // for deflate. So, if window size not set, force it to max when gzip possible
    if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
      // bit 3 (16) -> gzipped data
      // bit 4 (32) -> autodetect gzip/deflate
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }

    this.err    = 0;      // error code, if happens (0 = Z_OK)
    this.msg    = '';     // error message
    this.ended  = false;  // used to avoid multiple onEnd() calls
    this.chunks = [];     // chunks of compressed data

    this.strm   = new zstream();
    this.strm.avail_out = 0;

    let status  = inflate_1$1.inflateInit2(
      this.strm,
      opt.windowBits
    );

    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }

    this.header = new gzheader();

    inflate_1$1.inflateGetHeader(this.strm, this.header);

    // Setup dictionary
    if (opt.dictionary) {
      // Convert data if needed
      if (typeof opt.dictionary === 'string') {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) { //In raw mode we need to set the dictionary early
        status = inflate_1$1.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages[status]);
        }
      }
    }
  }

  /**
   * Inflate#push(data[, flush_mode]) -> Boolean
   * - data (Uint8Array|ArrayBuffer): input data
   * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
   *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
   *   `true` means Z_FINISH.
   *
   * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
   * new output chunks. Returns `true` on success. If end of stream detected,
   * [[Inflate#onEnd]] will be called.
   *
   * `flush_mode` is not needed for normal operation, because end of stream
   * detected automatically. You may try to use it for advanced things, but
   * this functionality was not tested.
   *
   * On fail call [[Inflate#onEnd]] with error code and return false.
   *
   * ##### Example
   *
   * ```javascript
   * push(chunk, false); // push one of data chunks
   * ...
   * push(chunk, true);  // push last chunk
   * ```
   **/
  Inflate.prototype.push = function (data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;

    if (this.ended) return false;

    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

    // Convert data if needed
    if (toString.call(data) === '[object ArrayBuffer]') {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }

    strm.next_in = 0;
    strm.avail_in = strm.input.length;

    for (;;) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }

      status = inflate_1$1.inflate(strm, _flush_mode);

      if (status === Z_NEED_DICT && dictionary) {
        status = inflate_1$1.inflateSetDictionary(strm, dictionary);

        if (status === Z_OK) {
          status = inflate_1$1.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          // Replace code with more verbose
          status = Z_NEED_DICT;
        }
      }

      // Skip snyc markers if more data follows and not raw mode
      while (strm.avail_in > 0 &&
             status === Z_STREAM_END &&
             strm.state.wrap > 0 &&
             data[strm.next_in] !== 0)
      {
        inflate_1$1.inflateReset(strm);
        status = inflate_1$1.inflate(strm, _flush_mode);
      }

      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }

      // Remember real `avail_out` value, because we may patch out buffer content
      // to align utf8 strings boundaries.
      last_avail_out = strm.avail_out;

      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {

          if (this.options.to === 'string') {

            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);

            // move tail & realign counters
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

            this.onData(utf8str);

          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }

      // Must repeat iteration if out buffer is full
      if (status === Z_OK && last_avail_out === 0) continue;

      // Finalize if end of stream reached.
      if (status === Z_STREAM_END) {
        status = inflate_1$1.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }

      if (strm.avail_in === 0) break;
    }

    return true;
  };


  /**
   * Inflate#onData(chunk) -> Void
   * - chunk (Uint8Array|String): output data. When string output requested,
   *   each chunk will be string.
   *
   * By default, stores data blocks in `chunks[]` property and glue
   * those in `onEnd`. Override this handler, if you need another behaviour.
   **/
  Inflate.prototype.onData = function (chunk) {
    this.chunks.push(chunk);
  };


  /**
   * Inflate#onEnd(status) -> Void
   * - status (Number): inflate status. 0 (Z_OK) on success,
   *   other if not.
   *
   * Called either after you tell inflate that the input stream is
   * complete (Z_FINISH). By default - join collected chunks,
   * free memory and fill `results` / `err` properties.
   **/
  Inflate.prototype.onEnd = function (status) {
    // On success - join
    if (status === Z_OK) {
      if (this.options.to === 'string') {
        this.result = this.chunks.join('');
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };


  /**
   * inflate(data[, options]) -> Uint8Array|String
   * - data (Uint8Array|ArrayBuffer): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * Decompress `data` with inflate/ungzip and `options`. Autodetect
   * format via wrapper header by default. That's why we don't provide
   * separate `ungzip` method.
   *
   * Supported options are:
   *
   * - windowBits
   *
   * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
   * for more information.
   *
   * Sugar (options):
   *
   * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
   *   negative windowBits implicitly.
   * - `to` (String) - if equal to 'string', then result will be converted
   *   from utf8 to utf16 (javascript) string. When string output requested,
   *   chunk length can differ from `chunkSize`, depending on content.
   *
   *
   * ##### Example:
   *
   * ```javascript
   * const pako = require('pako');
   * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
   * let output;
   *
   * try {
   *   output = pako.inflate(input);
   * } catch (err) {
   *   console.log(err);
   * }
   * ```
   **/
  function inflate(input, options) {
    const inflator = new Inflate(options);

    inflator.push(input);

    // That will never happens, if you don't cheat with options :)
    if (inflator.err) throw inflator.msg || messages[inflator.err];

    return inflator.result;
  }


  /**
   * inflateRaw(data[, options]) -> Uint8Array|String
   * - data (Uint8Array|ArrayBuffer): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * The same as [[inflate]], but creates raw data, without wrapper
   * (header and adler32 crc).
   **/
  function inflateRaw(input, options) {
    options = options || {};
    options.raw = true;
    return inflate(input, options);
  }


  /**
   * ungzip(data[, options]) -> Uint8Array|String
   * - data (Uint8Array|ArrayBuffer): input data to decompress.
   * - options (Object): zlib inflate options.
   *
   * Just shortcut to [[inflate]], because it autodetects format
   * by header.content. Done for convenience.
   **/


  var Inflate_1 = Inflate;
  var inflate_2 = inflate;
  var inflateRaw_1 = inflateRaw;
  var ungzip = inflate;
  var constants = constants$1;

  var inflate_1 = {
  	Inflate: Inflate_1,
  	inflate: inflate_2,
  	inflateRaw: inflateRaw_1,
  	ungzip: ungzip,
  	constants: constants
  };

  exports.Inflate = Inflate_1;
  exports.constants = constants;
  exports["default"] = inflate_1;
  exports.inflate = inflate_2;
  exports.inflateRaw = inflateRaw_1;
  exports.ungzip = ungzip;

  Object.defineProperty(exports, '__esModule', { value: true });

}));


;(function(){
var UPNG = {};

// Make available for import by `require()`
var pako;
if (typeof module == "object") {module.exports = UPNG;}  else {window.UPNG = UPNG;}
if (typeof require == "function") {pako = require("pako");}  else {pako = window.pako;}
function log() { if (typeof process=="undefined" || process.env.NODE_ENV=="development") console.log.apply(console, arguments);  }
(function(UPNG, pako){

	

	

UPNG.toRGBA8 = function(out)
{
	var w = out.width, h = out.height;
	if(out.tabs.acTL==null) return [UPNG.toRGBA8.decodeImage(out.data, w, h, out).buffer];
	
	var frms = [];
	if(out.frames[0].data==null) out.frames[0].data = out.data;
	
	var img, empty = new Uint8Array(w*h*4);
	for(var i=0; i<out.frames.length; i++)
	{
		var frm = out.frames[i];
		var fx=frm.rect.x, fy=frm.rect.y, fw = frm.rect.width, fh = frm.rect.height;
		var fdata = UPNG.toRGBA8.decodeImage(frm.data, fw,fh, out);
		
		if(i==0) img = fdata;
		else if(frm.blend  ==0) UPNG._copyTile(fdata, fw, fh, img, w, h, fx, fy, 0);
		else if(frm.blend  ==1) UPNG._copyTile(fdata, fw, fh, img, w, h, fx, fy, 1);
		
		frms.push(img.buffer);  img = img.slice(0);
		
		if     (frm.dispose==0) {}
		else if(frm.dispose==1) UPNG._copyTile(empty, fw, fh, img, w, h, fx, fy, 0);
		else if(frm.dispose==2) {
			var pi = i-1;
			while(out.frames[pi].dispose==2) pi--;
			img = new Uint8Array(frms[pi]).slice(0);
		}
	}
	return frms;
}
UPNG.toRGBA8.decodeImage = function(data, w, h, out)
{
	var area = w*h, bpp = UPNG.decode._getBPP(out);
	var bpl = Math.ceil(w*bpp/8);	// bytes per line

	var bf = new Uint8Array(area*4), bf32 = new Uint32Array(bf.buffer);
	var ctype = out.ctype, depth = out.depth;
	var rs = UPNG._bin.readUshort;
	
	//console.log(ctype, depth);

	if     (ctype==6) { // RGB + alpha
		var qarea = area<<2;
		if(depth== 8) for(var i=0; i<qarea;i++) {  bf[i] = data[i];  /*if((i&3)==3 && data[i]!=0) bf[i]=255;*/ }
		if(depth==16) for(var i=0; i<qarea;i++) {  bf[i] = data[i<<1];  }
	}
	else if(ctype==2) {	// RGB
		var ts=out.tabs["tRNS"], tr=-1, tg=-1, tb=-1;
		if(ts) {  tr=ts[0];  tg=ts[1];  tb=ts[2];  }
		if(depth== 8) for(var i=0; i<area; i++) {  var qi=i<<2, ti=i*3;  bf[qi] = data[ti];  bf[qi+1] = data[ti+1];  bf[qi+2] = data[ti+2];  bf[qi+3] = 255;
			if(tr!=-1 && data[ti]   ==tr && data[ti+1]   ==tg && data[ti+2]   ==tb) bf[qi+3] = 0;  }
		if(depth==16) for(var i=0; i<area; i++) {  var qi=i<<2, ti=i*6;  bf[qi] = data[ti];  bf[qi+1] = data[ti+2];  bf[qi+2] = data[ti+4];  bf[qi+3] = 255;
			if(tr!=-1 && rs(data,ti)==tr && rs(data,ti+2)==tg && rs(data,ti+4)==tb) bf[qi+3] = 0;  }
	}
	else if(ctype==3) {	// palette
		var p=out.tabs["PLTE"], ap=out.tabs["tRNS"], tl=ap?ap.length:0;
		//console.log(p, ap);
		if(depth==1) for(var y=0; y<h; y++) {  var s0 = y*bpl, t0 = y*w;
			for(var i=0; i<w; i++) { var qi=(t0+i)<<2, j=((data[s0+(i>>3)]>>(7-((i&7)<<0)))& 1), cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
		}
		if(depth==2) for(var y=0; y<h; y++) {  var s0 = y*bpl, t0 = y*w;
			for(var i=0; i<w; i++) { var qi=(t0+i)<<2, j=((data[s0+(i>>2)]>>(6-((i&3)<<1)))& 3), cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
		}
		if(depth==4) for(var y=0; y<h; y++) {  var s0 = y*bpl, t0 = y*w;
			for(var i=0; i<w; i++) { var qi=(t0+i)<<2, j=((data[s0+(i>>1)]>>(4-((i&1)<<2)))&15), cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
		}
		if(depth==8) for(var i=0; i<area; i++ ) {  var qi=i<<2, j=data[i]                      , cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
	}
	else if(ctype==4) {	// gray + alpha
		if(depth== 8)  for(var i=0; i<area; i++) {  var qi=i<<2, di=i<<1, gr=data[di];  bf[qi]=gr;  bf[qi+1]=gr;  bf[qi+2]=gr;  bf[qi+3]=data[di+1];  }
		if(depth==16)  for(var i=0; i<area; i++) {  var qi=i<<2, di=i<<2, gr=data[di];  bf[qi]=gr;  bf[qi+1]=gr;  bf[qi+2]=gr;  bf[qi+3]=data[di+2];  }
	}
	else if(ctype==0) {	// gray
		var tr = out.tabs["tRNS"] ? out.tabs["tRNS"] : -1;
		if(depth== 1) for(var i=0; i<area; i++) {  var gr=255*((data[i>>3]>>(7 -((i&7)   )))& 1), al=(gr==tr*255)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth== 2) for(var i=0; i<area; i++) {  var gr= 85*((data[i>>2]>>(6 -((i&3)<<1)))& 3), al=(gr==tr* 85)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth== 4) for(var i=0; i<area; i++) {  var gr= 17*((data[i>>1]>>(4 -((i&1)<<2)))&15), al=(gr==tr* 17)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth== 8) for(var i=0; i<area; i++) {  var gr=data[i  ] , al=(gr           ==tr)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth==16) for(var i=0; i<area; i++) {  var gr=data[i<<1], al=(rs(data,i<<1)==tr)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
	}
	return bf;
}



UPNG.decode = function(buff)
{
	var data = new Uint8Array(buff), offset = 8, bin = UPNG._bin, rUs = bin.readUshort, rUi = bin.readUint;
	var out = {tabs:{}, frames:[]};
	var dd = new Uint8Array(data.length), doff = 0;	 // put all IDAT data into it
	var fd, foff = 0;	// frames
	
	var mgck = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
	for(var i=0; i<8; i++) if(data[i]!=mgck[i]) throw "The input is not a PNG file!";

	while(offset<data.length)
	{
		var len  = bin.readUint(data, offset);  offset += 4;
		var type = bin.readASCII(data, offset, 4);  offset += 4;
		//log(type,len);
		
		if     (type=="IHDR")  {  UPNG.decode._IHDR(data, offset, out);  }
		else if(type=="IDAT") {
			for(var i=0; i<len; i++) dd[doff+i] = data[offset+i];
			doff += len;
		}
		else if(type=="acTL")  {
			out.tabs[type] = {  num_frames:rUi(data, offset), num_plays:rUi(data, offset+4)  };
			fd = new Uint8Array(data.length);
		}
		else if(type=="fcTL")  {
			if(foff!=0) {  var fr = out.frames[out.frames.length-1];
				fr.data = UPNG.decode._decompress(out, fd.slice(0,foff), fr.rect.width, fr.rect.height);  foff=0;
			}
			var rct = {x:rUi(data, offset+12),y:rUi(data, offset+16),width:rUi(data, offset+4),height:rUi(data, offset+8)};
			var del = rUs(data, offset+22);  del = rUs(data, offset+20) / (del==0?100:del);
			var frm = {rect:rct, delay:Math.round(del*1000), dispose:data[offset+24], blend:data[offset+25]};
			//console.log(frm);
			out.frames.push(frm);
		}
		else if(type=="fdAT") {
			for(var i=0; i<len-4; i++) fd[foff+i] = data[offset+i+4];
			foff += len-4;
		}
		else if(type=="pHYs") {
			out.tabs[type] = [bin.readUint(data, offset), bin.readUint(data, offset+4), data[offset+8]];
		}
		else if(type=="cHRM") {
			out.tabs[type] = [];
			for(var i=0; i<8; i++) out.tabs[type].push(bin.readUint(data, offset+i*4));
		}
		else if(type=="tEXt") {
			if(out.tabs[type]==null) out.tabs[type] = {};
			var nz = bin.nextZero(data, offset);
			var keyw = bin.readASCII(data, offset, nz-offset);
			var text = bin.readASCII(data, nz+1, offset+len-nz-1);
			out.tabs[type][keyw] = text;
		}
		else if(type=="iTXt") {
			if(out.tabs[type]==null) out.tabs[type] = {};
			var nz = 0, off = offset;
			nz = bin.nextZero(data, off);
			var keyw = bin.readASCII(data, off, nz-off);  off = nz + 1;
			var cflag = data[off], cmeth = data[off+1];  off+=2;
			nz = bin.nextZero(data, off);
			var ltag = bin.readASCII(data, off, nz-off);  off = nz + 1;
			nz = bin.nextZero(data, off);
			var tkeyw = bin.readUTF8(data, off, nz-off);  off = nz + 1;
			var text  = bin.readUTF8(data, off, len-(off-offset));
			out.tabs[type][keyw] = text;
		}
		else if(type=="PLTE") {
			out.tabs[type] = bin.readBytes(data, offset, len);
		}
		else if(type=="hIST") {
			var pl = out.tabs["PLTE"].length/3;
			out.tabs[type] = [];  for(var i=0; i<pl; i++) out.tabs[type].push(rUs(data, offset+i*2));
		}
		else if(type=="tRNS") {
			if     (out.ctype==3) out.tabs[type] = bin.readBytes(data, offset, len);
			else if(out.ctype==0) out.tabs[type] = rUs(data, offset);
			else if(out.ctype==2) out.tabs[type] = [ rUs(data,offset),rUs(data,offset+2),rUs(data,offset+4) ];
			//else console.log("tRNS for unsupported color type",out.ctype, len);
		}
		else if(type=="gAMA") out.tabs[type] = bin.readUint(data, offset)/100000;
		else if(type=="sRGB") out.tabs[type] = data[offset];
		else if(type=="bKGD")
		{
			if     (out.ctype==0 || out.ctype==4) out.tabs[type] = [rUs(data, offset)];
			else if(out.ctype==2 || out.ctype==6) out.tabs[type] = [rUs(data, offset), rUs(data, offset+2), rUs(data, offset+4)];
			else if(out.ctype==3) out.tabs[type] = data[offset];
		}
		else if(type=="IEND") {
			if(foff!=0) {  var fr = out.frames[out.frames.length-1];
				fr.data = UPNG.decode._decompress(out, fd.slice(0,foff), fr.rect.width, fr.rect.height);  foff=0;
			}	
			out.data = UPNG.decode._decompress(out, dd, out.width, out.height);  break;
		}
		//else {  log("unknown chunk type", type, len);  }
		offset += len;
		var crc = bin.readUint(data, offset);  offset += 4;
	}
	delete out.compress;  delete out.interlace;  delete out.filter;
	return out;
}

UPNG.decode._decompress = function(out, dd, w, h) {
	if(out.compress ==0) dd = UPNG.decode._inflate(dd);

	if     (out.interlace==0) dd = UPNG.decode._filterZero(dd, out, 0, w, h);
	else if(out.interlace==1) dd = UPNG.decode._readInterlace(dd, out);
	return dd;
}

UPNG.decode._inflate = function(data) {  return pako["inflate"](data);  }

UPNG.decode._readInterlace = function(data, out)
{
	var w = out.width, h = out.height;
	var bpp = UPNG.decode._getBPP(out), cbpp = bpp>>3, bpl = Math.ceil(w*bpp/8);
	var img = new Uint8Array( h * bpl );
	var di = 0;

	var starting_row  = [ 0, 0, 4, 0, 2, 0, 1 ];
	var starting_col  = [ 0, 4, 0, 2, 0, 1, 0 ];
	var row_increment = [ 8, 8, 8, 4, 4, 2, 2 ];
	var col_increment = [ 8, 8, 4, 4, 2, 2, 1 ];

	var pass=0;
	while(pass<7)
	{
		var ri = row_increment[pass], ci = col_increment[pass];
		var sw = 0, sh = 0;
		var cr = starting_row[pass];  while(cr<h) {  cr+=ri;  sh++;  }
		var cc = starting_col[pass];  while(cc<w) {  cc+=ci;  sw++;  }
		var bpll = Math.ceil(sw*bpp/8);
		UPNG.decode._filterZero(data, out, di, sw, sh);

		var y=0, row = starting_row[pass];
		while(row<h)
		{
			var col = starting_col[pass];
			var cdi = (di+y*bpll)<<3;

			while(col<w)
			{
				if(bpp==1) {
					var val = data[cdi>>3];  val = (val>>(7-(cdi&7)))&1;
					img[row*bpl + (col>>3)] |= (val << (7-((col&3)<<0)));
				}
				if(bpp==2) {
					var val = data[cdi>>3];  val = (val>>(6-(cdi&7)))&3;
					img[row*bpl + (col>>2)] |= (val << (6-((col&3)<<1)));
				}
				if(bpp==4) {
					var val = data[cdi>>3];  val = (val>>(4-(cdi&7)))&15;
					img[row*bpl + (col>>1)] |= (val << (4-((col&1)<<2)));
				}
				if(bpp>=8) {
					var ii = row*bpl+col*cbpp;
					for(var j=0; j<cbpp; j++) img[ii+j] = data[(cdi>>3)+j];
				}
				cdi+=bpp;  col+=ci;
			}
			y++;  row += ri;
		}
		if(sw*sh!=0) di += sh * (1 + bpll);
		pass = pass + 1;
	}
	return img;
}

UPNG.decode._getBPP = function(out) {
	var noc = [1,null,3,1,2,null,4][out.ctype];
	return noc * out.depth;
}

UPNG.decode._filterZero = function(data, out, off, w, h)
{
	var bpp = UPNG.decode._getBPP(out), bpl = Math.ceil(w*bpp/8), paeth = UPNG.decode._paeth;
	bpp = Math.ceil(bpp/8);

	for(var y=0; y<h; y++)  {
		var i = off+y*bpl, di = i+y+1;
		var type = data[di-1];

		if     (type==0) for(var x=  0; x<bpl; x++) data[i+x] = data[di+x];
		else if(type==1) {
			for(var x=  0; x<bpp; x++) data[i+x] = data[di+x];
			for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + data[i+x-bpp])&255;
		}
		else if(y==0) {
			for(var x=  0; x<bpp; x++) data[i+x] = data[di+x];
			if(type==2) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x])&255;
			if(type==3) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + (data[i+x-bpp]>>1) )&255;
			if(type==4) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + paeth(data[i+x-bpp], 0, 0) )&255;
		}
		else {
			if(type==2) { for(var x=  0; x<bpl; x++) data[i+x] = (data[di+x] + data[i+x-bpl])&255;  }

			if(type==3) { for(var x=  0; x<bpp; x++) data[i+x] = (data[di+x] + (data[i+x-bpl]>>1))&255;
			              for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + ((data[i+x-bpl]+data[i+x-bpp])>>1) )&255;  }

			if(type==4) { for(var x=  0; x<bpp; x++) data[i+x] = (data[di+x] + paeth(0, data[i+x-bpl], 0))&255;
						  for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + paeth(data[i+x-bpp], data[i+x-bpl], data[i+x-bpp-bpl]) )&255;  }
		}
	}
	return data;
}

UPNG.decode._paeth = function(a,b,c)
{
	var p = a+b-c, pa = Math.abs(p-a), pb = Math.abs(p-b), pc = Math.abs(p-c);
	if (pa <= pb && pa <= pc)  return a;
	else if (pb <= pc)  return b;
	return c;
}

UPNG.decode._IHDR = function(data, offset, out)
{
	var bin = UPNG._bin;
	out.width  = bin.readUint(data, offset);  offset += 4;
	out.height = bin.readUint(data, offset);  offset += 4;
	out.depth     = data[offset];  offset++;
	out.ctype     = data[offset];  offset++;
	out.compress  = data[offset];  offset++;
	out.filter    = data[offset];  offset++;
	out.interlace = data[offset];  offset++;
}

UPNG._bin = {
	nextZero   : function(data,p)  {  while(data[p]!=0) p++;  return p;  },
	readUshort : function(buff,p)  {  return (buff[p]<< 8) | buff[p+1];  },
	writeUshort: function(buff,p,n){  buff[p] = (n>>8)&255;  buff[p+1] = n&255;  },
	readUint   : function(buff,p)  {  return (buff[p]*(256*256*256)) + ((buff[p+1]<<16) | (buff[p+2]<< 8) | buff[p+3]);  },
	writeUint  : function(buff,p,n){  buff[p]=(n>>24)&255;  buff[p+1]=(n>>16)&255;  buff[p+2]=(n>>8)&255;  buff[p+3]=n&255;  },
	readASCII  : function(buff,p,l){  var s = "";  for(var i=0; i<l; i++) s += String.fromCharCode(buff[p+i]);  return s;    },
	writeASCII : function(data,p,s){  for(var i=0; i<s.length; i++) data[p+i] = s.charCodeAt(i);  },
	readBytes  : function(buff,p,l){  var arr = [];   for(var i=0; i<l; i++) arr.push(buff[p+i]);   return arr;  },
	pad : function(n) { return n.length < 2 ? "0" + n : n; },
	readUTF8 : function(buff, p, l) {
		var s = "", ns;
		for(var i=0; i<l; i++) s += "%" + UPNG._bin.pad(buff[p+i].toString(16));
		try {  ns = decodeURIComponent(s); }
		catch(e) {  return UPNG._bin.readASCII(buff, p, l);  }
		return  ns;
	}
}
UPNG._copyTile = function(sb, sw, sh, tb, tw, th, xoff, yoff, mode)
{
	var w = Math.min(sw,tw), h = Math.min(sh,th);
	var si=0, ti=0;
	for(var y=0; y<h; y++)
		for(var x=0; x<w; x++)
		{
			if(xoff>=0 && yoff>=0) {  si = (y*sw+x)<<2;  ti = (( yoff+y)*tw+xoff+x)<<2;  }
			else                   {  si = ((-yoff+y)*sw-xoff+x)<<2;  ti = (y*tw+x)<<2;  }
			
			if     (mode==0) {  tb[ti] = sb[si];  tb[ti+1] = sb[si+1];  tb[ti+2] = sb[si+2];  tb[ti+3] = sb[si+3];  }
			else if(mode==1) {
				var fa = sb[si+3]*(1/255), fr=sb[si]*fa, fg=sb[si+1]*fa, fb=sb[si+2]*fa; 
				var ba = tb[ti+3]*(1/255), br=tb[ti]*ba, bg=tb[ti+1]*ba, bb=tb[ti+2]*ba; 
				
				var ifa=1-fa, oa = fa+ba*ifa, ioa = (oa==0?0:1/oa);
				tb[ti+3] = 255*oa;  
				tb[ti+0] = (fr+br*ifa)*ioa;  
				tb[ti+1] = (fg+bg*ifa)*ioa;   
				tb[ti+2] = (fb+bb*ifa)*ioa;  
			}
			else if(mode==2){	// copy only differences, otherwise zero
				var fa = sb[si+3], fr=sb[si], fg=sb[si+1], fb=sb[si+2]; 
				var ba = tb[ti+3], br=tb[ti], bg=tb[ti+1], bb=tb[ti+2]; 
				if(fa==ba && fr==br && fg==bg && fb==bb) {  tb[ti]=0;  tb[ti+1]=0;  tb[ti+2]=0;  tb[ti+3]=0;  }
				else {  tb[ti]=fr;  tb[ti+1]=fg;  tb[ti+2]=fb;  tb[ti+3]=fa;  }
			}
			else if(mode==3){	// check if can be blended
				var fa = sb[si+3], fr=sb[si], fg=sb[si+1], fb=sb[si+2]; 
				var ba = tb[ti+3], br=tb[ti], bg=tb[ti+1], bb=tb[ti+2]; 
				if(fa==ba && fr==br && fg==bg && fb==bb) continue;
				//if(fa!=255 && ba!=0) return false;
				if(fa<220 && ba>20) return false;
			}
		}
	return true;
}



UPNG.encode = function(bufs, w, h, ps, dels, forbidPlte)
{
	if(ps==null) ps=0;
	if(forbidPlte==null) forbidPlte = false;
	var data = new Uint8Array(bufs[0].byteLength*bufs.length+100);
	var wr=[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
	for(var i=0; i<8; i++) data[i]=wr[i];
	var offset = 8,  bin = UPNG._bin, crc = UPNG.crc.crc, wUi = bin.writeUint, wUs = bin.writeUshort, wAs = bin.writeASCII;

	var nimg = UPNG.encode.compressPNG(bufs, w, h, ps, forbidPlte);

	wUi(data,offset, 13);     offset+=4;
	wAs(data,offset,"IHDR");  offset+=4;
	wUi(data,offset,w);  offset+=4;
	wUi(data,offset,h);  offset+=4;
	data[offset] = nimg.depth;  offset++;  // depth
	data[offset] = nimg.ctype;  offset++;  // ctype
	data[offset] = 0;  offset++;  // compress
	data[offset] = 0;  offset++;  // filter
	data[offset] = 0;  offset++;  // interlace
	wUi(data,offset,crc(data,offset-17,17));  offset+=4; // crc

	// 9 bytes to say, that it is sRGB
	wUi(data,offset, 1);      offset+=4;
	wAs(data,offset,"sRGB");  offset+=4;
	data[offset] = 1;  offset++;
	wUi(data,offset,crc(data,offset-5,5));  offset+=4; // crc

	var anim = bufs.length>1;
	if(anim) {
		wUi(data,offset, 8);      offset+=4;
		wAs(data,offset,"acTL");  offset+=4;
		wUi(data,offset, bufs.length);      offset+=4;
		wUi(data,offset, 0);      offset+=4;
		wUi(data,offset,crc(data,offset-12,12));  offset+=4; // crc
	}

	if(nimg.ctype==3) {
		var dl = nimg.plte.length;
		wUi(data,offset, dl*3);  offset+=4;
		wAs(data,offset,"PLTE");  offset+=4;
		for(var i=0; i<dl; i++){
			var ti=i*3, c=nimg.plte[i], r=(c)&255, g=(c>>8)&255, b=(c>>16)&255;
			data[offset+ti+0]=r;  data[offset+ti+1]=g;  data[offset+ti+2]=b;
		}
		offset+=dl*3;
		wUi(data,offset,crc(data,offset-dl*3-4,dl*3+4));  offset+=4; // crc

		if(nimg.gotAlpha) {
			wUi(data,offset, dl);  offset+=4;
			wAs(data,offset,"tRNS");  offset+=4;
			for(var i=0; i<dl; i++)  data[offset+i]=(nimg.plte[i]>>24)&255;
			offset+=dl;
			wUi(data,offset,crc(data,offset-dl-4,dl+4));  offset+=4; // crc
		}
	}
	
	var fi = 0;
	for(var j=0; j<nimg.frames.length; j++)
	{
		var fr = nimg.frames[j];
		if(anim) {
			wUi(data,offset, 26);     offset+=4;
			wAs(data,offset,"fcTL");  offset+=4;
			wUi(data, offset, fi++);   offset+=4;
			wUi(data, offset, fr.rect.width );   offset+=4;
			wUi(data, offset, fr.rect.height);   offset+=4;
			wUi(data, offset, fr.rect.x);   offset+=4;
			wUi(data, offset, fr.rect.y);   offset+=4;
			wUs(data, offset, dels[j]);   offset+=2;
			wUs(data, offset,  1000);   offset+=2;
			data[offset] = fr.dispose;  offset++;	// dispose
			data[offset] = fr.blend  ;  offset++;	// blend
			wUi(data,offset,crc(data,offset-30,30));  offset+=4; // crc
		}
				
		var imgd = fr.cimg, dl = imgd.length;
		wUi(data,offset, dl+(j==0?0:4));     offset+=4;
		var ioff = offset;
		wAs(data,offset,(j==0)?"IDAT":"fdAT");  offset+=4;
		if(j!=0) {  wUi(data, offset, fi++);  offset+=4;  }
		for(var i=0; i<dl; i++) data[offset+i] = imgd[i];
		offset += dl;
		wUi(data,offset,crc(data,ioff,offset-ioff));  offset+=4; // crc
	}

	wUi(data,offset, 0);     offset+=4;
	wAs(data,offset,"IEND");  offset+=4;
	wUi(data,offset,crc(data,offset-4,4));  offset+=4; // crc

	return data.buffer.slice(0,offset);
}

UPNG.encode.compressPNG = function(bufs, w, h, ps, forbidPlte)
{
	var out = UPNG.encode.compress(bufs, w, h, ps, false, forbidPlte);
	for(var i=0; i<bufs.length; i++) {
		var frm = out.frames[i], nw=frm.rect.width, nh=frm.rect.height, bpl=frm.bpl, bpp=frm.bpp;
		var fdata = new Uint8Array(nh*bpl+nh);
		frm.cimg = UPNG.encode._filterZero(frm.img,nh,bpp,bpl,fdata);
	}	
	return out;
}

UPNG.encode.compress = function(bufs, w, h, ps, forGIF, forbidPlte)
{
	if(forbidPlte==null) forbidPlte = false;
	
	var ctype = 6, depth = 8, bpp = 4, alphaAnd=255
	
	for(var j=0; j<bufs.length; j++)  {  // when not quantized, other frames can contain colors, that are not in an initial frame
		var img = new Uint8Array(bufs[j]), ilen = img.length;
		for(var i=0; i<ilen; i+=4) alphaAnd &= img[i+3];
	}
	var gotAlpha = (alphaAnd)!=255;
	
	var cmap={}, plte=[];  if(bufs.length!=0) {  cmap[0]=0;  plte.push(0);  if(ps!=0) ps--;  } 
	
	
	if(ps!=0) {
		var qres = UPNG.quantize(bufs, ps, forGIF);  bufs = qres.bufs;
		for(var i=0; i<qres.plte.length; i++) {  var c=qres.plte[i].est.rgba;  if(cmap[c]==null) {  cmap[c]=plte.length;  plte.push(c);  }     }
	}
	else {
		// what if ps==0, but there are <=256 colors?  we still need to detect, if the palette could be used
		for(var j=0; j<bufs.length; j++)  {  // when not quantized, other frames can contain colors, that are not in an initial frame
			var img32 = new Uint32Array(bufs[j]), ilen = img32.length;
			for(var i=0; i<ilen; i++) {
				var c = img32[i];
				if((i<w || (c!=img32[i-1] && c!=img32[i-w])) && cmap[c]==null) {  cmap[c]=plte.length;  plte.push(c);  if(plte.length>=300) break;  }
			}
		}
	}
	
	var brute = gotAlpha ? forGIF : false;		// brute : frames can only be copied, not "blended"
	var cc=plte.length;  //console.log(cc);
	if(cc<=256 && forbidPlte==false) {
		if(cc<= 2) depth=1;  else if(cc<= 4) depth=2;  else if(cc<=16) depth=4;  else depth=8;
		if(forGIF) depth=8;
		gotAlpha = true;
	}
	
	
	var frms = [];
	for(var j=0; j<bufs.length; j++)
	{
		var cimg = new Uint8Array(bufs[j]), cimg32 = new Uint32Array(cimg.buffer);
		
		var nx=0, ny=0, nw=w, nh=h, blend=0;
		if(j!=0 && !brute) {
			var tlim = (forGIF || j==1 || frms[frms.length-2].dispose==2)?1:2, tstp = 0, tarea = 1e9;
			for(var it=0; it<tlim; it++)
			{
				var pimg = new Uint8Array(bufs[j-1-it]), p32 = new Uint32Array(bufs[j-1-it]);
				var mix=w,miy=h,max=-1,may=-1;
				for(var y=0; y<h; y++) for(var x=0; x<w; x++) {
					var i = y*w+x;
					if(cimg32[i]!=p32[i]) {
						if(x<mix) mix=x;  if(x>max) max=x;
						if(y<miy) miy=y;  if(y>may) may=y;
					}
				}
				var sarea = (max==-1) ? 1 : (max-mix+1)*(may-miy+1);
				if(sarea<tarea) {
					tarea = sarea;  tstp = it;  
					if(max==-1) {  nx=ny=0;  nw=nh=1;  }
					else {  nx = mix; ny = miy; nw = max-mix+1; nh = may-miy+1;  }
				}
			}
			
			var pimg = new Uint8Array(bufs[j-1-tstp]);
			if(tstp==1) frms[frms.length-1].dispose = 2;
			
			var nimg = new Uint8Array(nw*nh*4), nimg32 = new Uint32Array(nimg.buffer);
			UPNG.   _copyTile(pimg,w,h, nimg,nw,nh, -nx,-ny, 0);
			if(UPNG._copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 3)) {
				UPNG._copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 2);  blend = 1;
			}
			else {
				UPNG._copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 0);  blend = 0;
			}
			cimg = nimg;  cimg32 = new Uint32Array(cimg.buffer);
		}
		var bpl = 4*nw;
		if(cc<=256 && forbidPlte==false) {
			bpl = Math.ceil(depth*nw/8);
			var nimg = new Uint8Array(bpl*nh);
			for(var y=0; y<nh; y++) {  var i=y*bpl, ii=y*nw;
				if     (depth==8) for(var x=0; x<nw; x++) nimg[i+(x)   ]   =  (cmap[cimg32[ii+x]]             );
				else if(depth==4) for(var x=0; x<nw; x++) nimg[i+(x>>1)]  |=  (cmap[cimg32[ii+x]]<<(4-(x&1)*4));
				else if(depth==2) for(var x=0; x<nw; x++) nimg[i+(x>>2)]  |=  (cmap[cimg32[ii+x]]<<(6-(x&3)*2));
				else if(depth==1) for(var x=0; x<nw; x++) nimg[i+(x>>3)]  |=  (cmap[cimg32[ii+x]]<<(7-(x&7)*1));
			}
			cimg=nimg;  ctype=3;  bpp=1;
		}
		else if(gotAlpha==false && bufs.length==1) {	// some next "reduced" frames may contain alpha for blending
			var nimg = new Uint8Array(nw*nh*3), area=nw*nh;
			for(var i=0; i<area; i++) { var ti=i*3, qi=i*4;  nimg[ti]=cimg[qi];  nimg[ti+1]=cimg[qi+1];  nimg[ti+2]=cimg[qi+2];  }
			cimg=nimg;  ctype=2;  bpp=3;  bpl=3*nw;
		}
		frms.push({rect:{x:nx,y:ny,width:nw,height:nh}, img:cimg, bpl:bpl, bpp:bpp, blend:blend, dispose:brute?1:0});
	}
	return {ctype:ctype, depth:depth, plte:plte, gotAlpha:gotAlpha, frames:frms  };
}

UPNG.encode._filterZero = function(img,h,bpp,bpl,data)
{
	var fls = [];
	for(var t=0; t<5; t++) {  if(h*bpl>500000 && (t==2 || t==3 || t==4)) continue;
		for(var y=0; y<h; y++) UPNG.encode._filterLine(data, img, y, bpl, bpp, t);
		fls.push(pako["deflate"](data));  if(bpp==1) break;
	}
	var ti, tsize=1e9;
	for(var i=0; i<fls.length; i++) if(fls[i].length<tsize) {  ti=i;  tsize=fls[i].length;  }
	return fls[ti];
}
UPNG.encode._filterLine = function(data, img, y, bpl, bpp, type)
{
	var i = y*bpl, di = i+y, paeth = UPNG.decode._paeth
	data[di]=type;  di++;

	if(type==0) for(var x=0; x<bpl; x++) data[di+x] = img[i+x];
	else if(type==1) {
		for(var x=  0; x<bpp; x++) data[di+x] =  img[i+x];
		for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x]-img[i+x-bpp]+256)&255;
	}
	else if(y==0) {
		for(var x=  0; x<bpp; x++) data[di+x] = img[i+x];

		if(type==2) for(var x=bpp; x<bpl; x++) data[di+x] = img[i+x];
		if(type==3) for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x] - (img[i+x-bpp]>>1) +256)&255;
		if(type==4) for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x] - paeth(img[i+x-bpp], 0, 0) +256)&255;
	}
	else {
		if(type==2) { for(var x=  0; x<bpl; x++) data[di+x] = (img[i+x]+256 - img[i+x-bpl])&255;  }
		if(type==3) { for(var x=  0; x<bpp; x++) data[di+x] = (img[i+x]+256 - (img[i+x-bpl]>>1))&255;
					  for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x]+256 - ((img[i+x-bpl]+img[i+x-bpp])>>1))&255;  }
		if(type==4) { for(var x=  0; x<bpp; x++) data[di+x] = (img[i+x]+256 - paeth(0, img[i+x-bpl], 0))&255;
					  for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x]+256 - paeth(img[i+x-bpp], img[i+x-bpl], img[i+x-bpp-bpl]))&255;  }
	}
}

UPNG.crc = {
	table : ( function() {
	   var tab = new Uint32Array(256);
	   for (var n=0; n<256; n++) {
			var c = n;
			for (var k=0; k<8; k++) {
				if (c & 1)  c = 0xedb88320 ^ (c >>> 1);
				else        c = c >>> 1;
			}
			tab[n] = c;  }
		return tab;  })(),
	update : function(c, buf, off, len) {
		for (var i=0; i<len; i++)  c = UPNG.crc.table[(c ^ buf[off+i]) & 0xff] ^ (c >>> 8);
		return c;
	},
	crc : function(b,o,l)  {  return UPNG.crc.update(0xffffffff,b,o,l) ^ 0xffffffff;  }
}


UPNG.quantize = function(bufs, ps, roundAlpha)
{	
	var imgs = [], totl = 0;
	for(var i=0; i<bufs.length; i++) {  imgs.push(UPNG.encode.alphaMul(new Uint8Array(bufs[i]), roundAlpha));  totl+=bufs[i].byteLength;  }
	
	var nimg = new Uint8Array(totl), nimg32 = new Uint32Array(nimg.buffer), noff=0;
	for(var i=0; i<imgs.length; i++) {
		var img = imgs[i], il = img.length;
		for(var j=0; j<il; j++) nimg[noff+j] = img[j];
		noff += il;
	}
	
	var root = {i0:0, i1:nimg.length, bst:null, est:null, tdst:0, left:null, right:null };  // basic statistic, extra statistic
	root.bst = UPNG.quantize.stats(  nimg,root.i0, root.i1  );  root.est = UPNG.quantize.estats( root.bst );
	var leafs = [root];
	
	while(leafs.length<ps)
	{
		var maxL = 0, mi=0;
		for(var i=0; i<leafs.length; i++) if(leafs[i].est.L > maxL) {  maxL=leafs[i].est.L;  mi=i;  }
		if(maxL<1e-3) break;
		var node = leafs[mi];
		
		var s0 = UPNG.quantize.splitPixels(nimg,nimg32, node.i0, node.i1, node.est.e, node.est.eMq255);
		
		var ln = {i0:node.i0, i1:s0, bst:null, est:null, tdst:0, left:null, right:null };  ln.bst = UPNG.quantize.stats( nimg, ln.i0, ln.i1 );  
		ln.est = UPNG.quantize.estats( ln.bst );
		var rn = {i0:s0, i1:node.i1, bst:null, est:null, tdst:0, left:null, right:null };  rn.bst = {R:[], m:[], N:node.bst.N-ln.bst.N};
		for(var i=0; i<16; i++) rn.bst.R[i] = node.bst.R[i]-ln.bst.R[i];
		for(var i=0; i< 4; i++) rn.bst.m[i] = node.bst.m[i]-ln.bst.m[i];
		rn.est = UPNG.quantize.estats( rn.bst );
		
		node.left = ln;  node.right = rn;
		leafs[mi]=ln;  leafs.push(rn);
	}
	leafs.sort(function(a,b) {  return b.bst.N-a.bst.N;  });
	
	for(var ii=0; ii<imgs.length; ii++) {
		var planeDst = UPNG.quantize.planeDst;
		var sb = new Uint8Array(imgs[ii].buffer), tb = new Uint32Array(imgs[ii].buffer), len = sb.length;
		
		var stack = [], si=0;
		for(var i=0; i<len; i+=4) {
			var r=sb[i]*(1/255), g=sb[i+1]*(1/255), b=sb[i+2]*(1/255), a=sb[i+3]*(1/255);
			
			//  exact, but too slow :(
			//var nd = UPNG.quantize.getNearest(root, r, g, b, a);
			var nd = root;
			while(nd.left) nd = (planeDst(nd.est,r,g,b,a)<=0) ? nd.left : nd.right;
			
			tb[i>>2] = nd.est.rgba;
		}
		imgs[ii]=tb.buffer;
	}
	return {  bufs:imgs, plte:leafs  };
}
UPNG.quantize.getNearest = function(nd, r,g,b,a)
{
	if(nd.left==null) {  nd.tdst = UPNG.quantize.dist(nd.est.q,r,g,b,a);  return nd;  }
	var planeDst = UPNG.quantize.planeDst(nd.est,r,g,b,a);
	
	var node0 = nd.left, node1 = nd.right;
	if(planeDst>0) {  node0=nd.right;  node1=nd.left;  }
	
	var ln = UPNG.quantize.getNearest(node0, r,g,b,a);
	if(ln.tdst<=planeDst*planeDst) return ln;
	var rn = UPNG.quantize.getNearest(node1, r,g,b,a);
	return rn.tdst<ln.tdst ? rn : ln;
}
UPNG.quantize.planeDst = function(est, r,g,b,a) {  var e = est.e;  return e[0]*r + e[1]*g + e[2]*b + e[3]*a - est.eMq;  }
UPNG.quantize.dist     = function(q,   r,g,b,a) {  var d0=r-q[0], d1=g-q[1], d2=b-q[2], d3=a-q[3];  return d0*d0+d1*d1+d2*d2+d3*d3;  }

UPNG.quantize.splitPixels = function(nimg, nimg32, i0, i1, e, eMq)
{
	var vecDot = UPNG.quantize.vecDot;
	i1-=4;
	var shfs = 0;
	while(i0<i1)
	{
		while(vecDot(nimg, i0, e)<=eMq) i0+=4;
		while(vecDot(nimg, i1, e)> eMq) i1-=4;
		if(i0>=i1) break;
		
		var t = nimg32[i0>>2];  nimg32[i0>>2] = nimg32[i1>>2];  nimg32[i1>>2]=t;
		
		i0+=4;  i1-=4;
	}
	while(vecDot(nimg, i0, e)>eMq) i0-=4;
	return i0+4;
}
UPNG.quantize.vecDot = function(nimg, i, e)
{
	return nimg[i]*e[0] + nimg[i+1]*e[1] + nimg[i+2]*e[2] + nimg[i+3]*e[3];
}
UPNG.quantize.stats = function(nimg, i0, i1){
	var R = [0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0];
	var m = [0,0,0,0];
	var N = (i1-i0)>>2;
	for(var i=i0; i<i1; i+=4)
	{
		var r = nimg[i]*(1/255), g = nimg[i+1]*(1/255), b = nimg[i+2]*(1/255), a = nimg[i+3]*(1/255);
		//var r = nimg[i], g = nimg[i+1], b = nimg[i+2], a = nimg[i+3];
		m[0]+=r;  m[1]+=g;  m[2]+=b;  m[3]+=a;
		
		R[ 0] += r*r;  R[ 1] += r*g;  R[ 2] += r*b;  R[ 3] += r*a;  
		               R[ 5] += g*g;  R[ 6] += g*b;  R[ 7] += g*a; 
		                              R[10] += b*b;  R[11] += b*a;  
		                                             R[15] += a*a;  
	}
	R[4]=R[1];  R[8]=R[2];  R[12]=R[3];  R[9]=R[6];  R[13]=R[7];  R[14]=R[11];
	
	return {R:R, m:m, N:N};
}
UPNG.quantize.estats = function(stats){
	var R = stats.R, m = stats.m, N = stats.N;
	
	var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], iN = (N==0 ? 0 : 1/N);
	var Rj = [
		R[ 0] - m0*m0*iN,  R[ 1] - m0*m1*iN,  R[ 2] - m0*m2*iN,  R[ 3] - m0*m3*iN,  
		R[ 4] - m1*m0*iN,  R[ 5] - m1*m1*iN,  R[ 6] - m1*m2*iN,  R[ 7] - m1*m3*iN,
		R[ 8] - m2*m0*iN,  R[ 9] - m2*m1*iN,  R[10] - m2*m2*iN,  R[11] - m2*m3*iN,  
		R[12] - m3*m0*iN,  R[13] - m3*m1*iN,  R[14] - m3*m2*iN,  R[15] - m3*m3*iN 
	];
	
	var A = Rj, M = UPNG.M4;
	var b = [0.5,0.5,0.5,0.5], mi = 0, tmi = 0;
	
	if(N!=0)
	for(var i=0; i<10; i++) {
		b = M.multVec(A, b);  tmi = Math.sqrt(M.dot(b,b));  b = M.sml(1/tmi,  b);
		if(Math.abs(tmi-mi)<1e-9) break;  mi = tmi;
	}	
	//b = [0,0,1,0];  mi=N;
	var q = [m0*iN, m1*iN, m2*iN, m3*iN];
	var eMq255 = M.dot(M.sml(255,q),b);
	
	var ia = (q[3]<0.001) ? 0 : 1/q[3];
	
	return {  Cov:Rj, q:q, e:b, L:mi,  eMq255:eMq255, eMq : M.dot(b,q),
				rgba: (((Math.round(255*q[3])<<24) | (Math.round(255*q[2]*ia)<<16) |  (Math.round(255*q[1]*ia)<<8) | (Math.round(255*q[0]*ia)<<0))>>>0)  };
}
UPNG.M4 = {
	multVec : function(m,v) {
			return [
				m[ 0]*v[0] + m[ 1]*v[1] + m[ 2]*v[2] + m[ 3]*v[3],
				m[ 4]*v[0] + m[ 5]*v[1] + m[ 6]*v[2] + m[ 7]*v[3],
				m[ 8]*v[0] + m[ 9]*v[1] + m[10]*v[2] + m[11]*v[3],
				m[12]*v[0] + m[13]*v[1] + m[14]*v[2] + m[15]*v[3]
			];
	},
	dot : function(x,y) {  return  x[0]*y[0]+x[1]*y[1]+x[2]*y[2]+x[3]*y[3];  },
	sml : function(a,y) {  return [a*y[0],a*y[1],a*y[2],a*y[3]];  }
}

UPNG.encode.alphaMul = function(img, roundA) {
	var nimg = new Uint8Array(img.length), area = img.length>>2; 
	for(var i=0; i<area; i++) {
		var qi=i<<2, ia=img[qi+3];   
		if(roundA) ia = ((ia<128))?0:255;
		var a = ia*(1/255);
		nimg[qi+0] = img[qi+0]*a;  nimg[qi+1] = img[qi+1]*a;  nimg[qi+2] = img[qi+2]*a;  nimg[qi+3] = ia;
	}
	return nimg;
}

	
	
	
	
	


})(UPNG, pako);
})();

