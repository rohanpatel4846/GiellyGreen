using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GiellyGreen.Models.Profile
{
    public class ProfileViewModal
    {
        public int id { get; set; } = 0;
        public string CompanyName { get; set; }
        public string AddressLine { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        public string Country { get; set; }
        public string DefaultVAT { get; set; }
    }
}