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


#if !defined(FIT_CAPABILITIES_MESG_LISTENER_HPP)
#define FIT_CAPABILITIES_MESG_LISTENER_HPP

#include "fit_capabilities_mesg.hpp"

namespace fit
{

class CapabilitiesMesgListener
{
public:
    virtual ~CapabilitiesMesgListener() {}
    virtual void OnMesg(CapabilitiesMesg& mesg) = 0;
};

} // namespace fit

#endif // !defined(FIT_CAPABILITIES_MESG_LISTENER_HPP)
