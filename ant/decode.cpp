////////////////////////////////////////////////////////////////////////////////
// The following FIT Protocol software provided may be used with FIT protocol
// devices only and remains the copyrighted property of Garmin Canada Inc.
// The software is being provided on an "as-is" basis and as an accommodation,
// and therefore all warranties, representations, or guarantees of any kind
// (whether express, implied or statutory) including, without limitation,
// warranties of merchantability, non-infringement, or fitness for a particular
// purpose, are specifically disclaimed.
//
// Copyright 2008 Garmin Canada Inc.
////////////////////////////////////////////////////////////////////////////////

#include <fstream>
#include <iostream>
#include <sstream>

#include "bytebuf.hpp"
#include "fit_decode.hpp"
#include "fit_mesg_broadcaster.hpp"
#include "fit_developer_field_description.hpp"

class Listener : public fit::MesgListener
{
public :
    std::stringstream gpx;
    static double getFirstValue(const fit::FieldBase& field)
    {
        // We only really look at the first one, because we return as soon as we find anything
        for (FIT_UINT8 j = 0; j < (FIT_UINT8)field.GetNumValues(); j++)
        {
            switch (field.GetType())
            {
            // Get float 64 values for numeric types to receive values that have
            // their scale and offset properly applied.
            case FIT_BASE_TYPE_ENUM:
            case FIT_BASE_TYPE_BYTE:
            case FIT_BASE_TYPE_SINT8:
            case FIT_BASE_TYPE_UINT8:
            case FIT_BASE_TYPE_SINT16:
            case FIT_BASE_TYPE_UINT16:
            case FIT_BASE_TYPE_SINT32:
            case FIT_BASE_TYPE_UINT32:
            case FIT_BASE_TYPE_SINT64:
            case FIT_BASE_TYPE_UINT64:
            case FIT_BASE_TYPE_UINT8Z:
            case FIT_BASE_TYPE_UINT16Z:
            case FIT_BASE_TYPE_UINT32Z:
            case FIT_BASE_TYPE_UINT64Z:
            case FIT_BASE_TYPE_FLOAT32:
            case FIT_BASE_TYPE_FLOAT64:
                return field.GetFLOAT64Value(j);
                break;
            case FIT_BASE_TYPE_STRING:
                return 0.0; // None of the fields we care about are strings.
                break;
            default:
                break;
            }
        }
        return 0.0;
    }

    void OnMesg(fit::Mesg& mesg) override
    {
        bool has_lat = false;
        double lat;
        bool has_lon = false;
        double lon;
        bool has_time = false;
        uint64_t time;
        bool has_speed = false;
        double speed;

        /* Used to convert back to degrees below.
         * degrees = semicircles * (180 / 2 ^ 31)
         */

        for (FIT_UINT16 i = 0; i < (FIT_UINT16)mesg.GetNumFields(); i++)
        {
            fit::Field* field = mesg.GetFieldByIndex(i);
            if (field->GetName() == "position_lat") {
                has_lat = true;
                lat = getFirstValue(*field) * (180.0 / 2147483648.0);
            }
            if (field->GetName() == "position_long") {
                has_lon = true;
                lon = getFirstValue(*field) * (180.0 / 2147483648.0);
            }
            if (field->GetName() == "timestamp") {
                has_time = true;
                // FIT timestamps start at midnight on Sunday, Dec 31st, 1989, stupidly.
                time = static_cast<uint64_t>(getFirstValue(*field)) + 631065600ull;
            }
            if (field->GetName() == "speed") {
                has_speed = true;
                speed = getFirstValue(*field);
            }
        }

        if (has_lat && has_lon && has_time) {
            gpx.precision(8);
            gpx << "<trkpt lat=\"" << lat << "\" lon=\"" << lon << "\"><time>" << time << "</time></trkpt>\n";
        }
    }

};

extern "C" {

const char* decode_fit(int size, const unsigned char* data)
{
   // This is not thread-safe or re-entrant, and can be called exactly once-at-a-time.
   static std::string out;
   out.clear();

   fit::Decode decode;
   Listener listener;

   bytebuf filebuf(data, size);
   std::istream file(&filebuf);

   if (!decode.CheckIntegrity(file))
   {
      printf("FIT file integrity failed.\n");
      return "";
   }

   try
   {
      decode.Read(file, listener);
   }
   catch (const fit::RuntimeException& e)
   {
      printf("Exception decoding file: %s\n", e.what());
      return "";
   }

   out = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
   out += "<gpx><trk><trkseg>";
   out += listener.gpx.str();
   out += "</trkseg></trk></gpx>";
   return out.c_str();
}

}
