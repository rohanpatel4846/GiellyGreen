using DataAccessLayer.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using GiellyGreen.Models.Supplier;
using GiellyGreen.Models.Invoice;
using GiellyGreen.Models.Month;
using GiellyGreen.Models.Profile;

namespace DataAccessLayer.Classes
{
    internal class FixingModels
    {
        public static Supplier FixUp(SupplierViewModel model)
        {
            Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<SupplierViewModel, Supplier>()));
            var objSupplier = mapper.Map<SupplierViewModel, Supplier>(model);
            return objSupplier;
        }

        public static Invoice FixUp(InvoiceViewModel model)
        {
            Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<InvoiceViewModel, Invoice>()));
            var objInvoice = mapper.Map<InvoiceViewModel, Invoice>(model);
            return objInvoice;
        }

        public static MonthInvoice FixUp(MonthInvoiceViewModel model)
        {
            Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<MonthInvoiceViewModel, MonthInvoice>()));
            var objMonthInvoice = mapper.Map<MonthInvoiceViewModel, MonthInvoice>(model);
            return objMonthInvoice;
        }

        public static profile FixUp(ProfileViewModal model)
        {
            Mapper mapper = new Mapper(new MapperConfiguration(cfg => cfg.CreateMap<ProfileViewModal, profile>()));
            var objProfile = mapper.Map<ProfileViewModal, profile>(model);
            return objProfile;
        }
    }
}
