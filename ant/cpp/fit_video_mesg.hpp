////////////////////////////////////////////////////////////////////////////////
// The following FIT Protocol software provided may be used with FIT protocol
// devices only and remains the copyrighted property of Garmin Canada Inc.
// The software is being provided on an "as-is" basis and as an accommodation,
// and therefore all warranties, representations, or guarantees of any kind
// (whether express, implied or statutory) including, without limitation,
// warranties of merchantability, non-infringement, or fitness for a particular
// purpose, are specifically disclaimed.
//
// Copyright 2019 Garmin Canada Inc.
////////////////////////////////////////////////////////////////////////////////
// ****WARNING****  This file is auto-generated!  Do NOT edit this file.
// Profile Version = 20.88Release
// Tag = production/akw/20.88.00-0-g6de0d21
////////////////////////////////////////////////////////////////////////////////


#if !defined(FIT_VIDEO_MESG_HPP)
#define FIT_VIDEO_MESG_HPP

#include "fit_mesg.hpp"

namespace fit
{

class VideoMesg : public Mesg
{
public:
    class FieldDefNum final
    {
    public:
       static const FIT_UINT8 Url = 0;
       static const FIT_UINT8 HostingProvider = 1;
       static const FIT_UINT8 Duration = 2;
       static const FIT_UINT8 Invalid = FIT_FIELD_NUM_INVALID;
    };

    VideoMesg(void) : Mesg(Profile::MESG_VIDEO)
    {
    }

    VideoMesg(const Mesg &mesg) : Mesg(mesg)
    {
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of url field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsUrlValid() const
    {
        const Field* field = GetField(0);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns url field
    ///////////////////////////////////////////////////////////////////////
    FIT_WSTRING GetUrl(void) const
    {
        return GetFieldSTRINGValue(0, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set url field
    ///////////////////////////////////////////////////////////////////////
    void SetUrl(FIT_WSTRING url)
    {
        SetFieldSTRINGValue(0, url, 0);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of hosting_provider field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsHostingProviderValid() const
    {
        const Field* field = GetField(1);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns hosting_provider field
    ///////////////////////////////////////////////////////////////////////
    FIT_WSTRING GetHostingProvider(void) const
    {
        return GetFieldSTRINGValue(1, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set hosting_provider field
    ///////////////////////////////////////////////////////////////////////
    void SetHostingProvider(FIT_WSTRING hostingProvider)
    {
        SetFieldSTRINGValue(1, hostingProvider, 0);
    }

    ///////////////////////////////////////////////////////////////////////
    // Checks the validity of duration field
    // Returns FIT_TRUE if field is valid
    ///////////////////////////////////////////////////////////////////////
    FIT_BOOL IsDurationValid() const
    {
        const Field* field = GetField(2);
        if( FIT_NULL == field )
        {
            return FIT_FALSE;
        }

        return field->IsValueValid();
    }

    ///////////////////////////////////////////////////////////////////////
    // Returns duration field
    // Units: ms
    // Comment: Playback time of video
    ///////////////////////////////////////////////////////////////////////
    FIT_UINT32 GetDuration(void) const
    {
        return GetFieldUINT32Value(2, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

    ///////////////////////////////////////////////////////////////////////
    // Set duration field
    // Units: ms
    // Comment: Playback time of video
    ///////////////////////////////////////////////////////////////////////
    void SetDuration(FIT_UINT32 duration)
    {
        SetFieldUINT32Value(2, duration, 0, FIT_SUBFIELD_INDEX_MAIN_FIELD);
    }

};

} // namespace fit

#endif // !defined(FIT_VIDEO_MESG_HPP)
